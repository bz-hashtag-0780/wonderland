import BasicBeastsNFTStaking from "./BasicBeastsNFTStaking.cdc"

pub contract BasicBeastsNFTStakingRewards {

    pub event ContractInitialized()
    pub event RewardItemTemplateCreated(rewardItemTemplateID: UInt32, name: String?, description: String?, image: String?)
    pub event RewardItemAdded(nftID: UInt64, rewardItemID: UInt32, rewardItemTemplateID: UInt32)
    pub event RewardItemRemoved(nftID: UInt64, rewardItemID: UInt32, rewardItemTemplateID: UInt32)
    pub event RewardItemMoved(fromID: UInt64, toID: UInt64, rewardItemID: UInt32, rewardItemTemplateID: UInt32)

    pub let RevealerStoragePath: StoragePath
    pub let AdminStoragePath: StoragePath
    pub let AdminPrivatePath: PrivatePath

    pub var totalSupply: UInt32
    pub var burned: UInt32
    pub var rewardPerSecond: UFix64
    access(self) var rewardItemTemplates: {UInt32: RewardItemTemplate}
    access(self) var rewards: {UInt64: {UInt32: RewardItem}} // {nftID: {rewardItem.id: RewardItem}}

    // -----------------------------------------------------------------------
    // Reward Item Template
    // -----------------------------------------------------------------------
    pub struct RewardItemTemplate {
        pub let rewardItemTemplateID: UInt32
        pub let name: String?
        pub let description: String?
        pub let image: String?

        init(rewardItemTemplateID: UInt32, name: String?, description: String?, image: String?) {
            self.rewardItemTemplateID = rewardItemTemplateID
            self.name = name
            self.description = description
            self.image = image
        }
    }

    // -----------------------------------------------------------------------
    // Reward Item
    // -----------------------------------------------------------------------
    pub struct RewardItem {

        pub let id: UInt32
        pub let rewardItemTemplateID: UInt32
        pub let timestamp: UFix64
        pub var revealed: Bool

        init(rewardItemTemplateID: UInt32) {
            pre {
                BasicBeastsNFTStakingRewards.rewardItemTemplates[rewardItemTemplateID] != nil: "Cannot initialize RewardItem: RewardItemTemplate doesn't exist"
            }
            self.id = BasicBeastsNFTStakingRewards.totalSupply
            self.rewardItemTemplateID = rewardItemTemplateID
            self.timestamp = getCurrentBlock().timestamp
            self.revealed = false
        }

        pub fun reveal() { //TODO: test if this can be called by anyone or only the revealer
            if(!self.revealed) {
                self.revealed = true
            }
        }
    }

    pub resource Revealer {

        pub fun revealRewardItem(nftID: UInt64, rewardItemID: UInt32) {
            pre {
                self.owner != nil: "Can't reveal rewardItem: self.owner is nil"
                getAccount(self.owner!.address).capabilities.get<&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}>(BasicBeastsNFTStaking.CollectionPublicPath) != nil: "Can't reveal: address don't have the NFT staked"
            }

            // Verify NFT holder
            let revealerAddress = self.owner!.address

            // Check if NFT holder has the NFT in the staking collection
            var collectionRef:&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}?  = nil
            
            if let cap = getAccount(revealerAddress).capabilities.get<&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}>(BasicBeastsNFTStaking.CollectionPublicPath) {
                collectionRef = cap.borrow()
            }

            if(collectionRef != nil) {
                let IDs = collectionRef!.getIDs()
                assert(IDs.contains(nftID), message: "This address does not hold the NFT")
            }

            // Reveal NFT
            if(BasicBeastsNFTStakingRewards.rewards[nftID] != nil && BasicBeastsNFTStakingRewards.rewards[nftID]![rewardItemID] != nil) {
            BasicBeastsNFTStakingRewards.rewards[nftID]![rewardItemID]!.reveal()
            } else {
                panic("NFT or reward item does not exist")
            }

        }

    }

    pub resource Admin {

        pub fun giveReward(toID: UInt64) {
            // check if NFT is staking
            if let adjustedStakingDate = BasicBeastsNFTStaking.getAdjustedStakingDate(id: toID) {
                let timeStaked = getCurrentBlock().timestamp - adjustedStakingDate

                // check if eligible to receive reward
                if(timeStaked >= BasicBeastsNFTStakingRewards.rewardPerSecond) {
                    // give random reward
                    let rewardID = UInt32(self.randomReward())
                    BasicBeastsNFTStakingRewards.addReward(nftID: toID, rewardItemTemplateID: rewardID)

                    // update AdjustedStakingDate to prevent duplicate rewards
                    BasicBeastsNFTStaking.updateAdjustedStakingDate(id: toID, rewardPerSecond: BasicBeastsNFTStakingRewards.rewardPerSecond)

                }
            }
            
        }

        access(self) fun randomReward(): Int {
            // Generate a random number between 0 and 100_000_000
            let randomNum = Int(unsafeRandom() % 100_000_000)
            
            let threshold1 = 69_000_000 // for 69%
            let threshold2 = 87_000_000 // for 18%, cumulative 87%
            let threshold3 = 95_000_000 // for 8%, cumulative 95%
            let threshold4 = 99_000_000 // for 4%, cumulative 99%
            
            // Return reward based on generated random number
            if randomNum < threshold1 { return 1 }
            else if randomNum < threshold2 { return 2 }
            else if randomNum < threshold3 { return 3 }
            else if randomNum < threshold4 { return 4 }
            else { return 5 } // for remaining 1%
        }

        pub fun burnReward(nftID: UInt64, rewardItemID: UInt32) {
            BasicBeastsNFTStakingRewards.removeReward(nftID: nftID, rewardItemID: rewardItemID)
        }

        pub fun transferReward(fromID: UInt64, toID: UInt64, rewardItemID: UInt32) {
            BasicBeastsNFTStakingRewards.moveReward(fromID: fromID, toID: toID, rewardItemID: rewardItemID)
        }

        pub fun changeRewardPerSecond(seconds: UFix64) {
            BasicBeastsNFTStakingRewards.rewardPerSecond = seconds
        }

        pub fun createRewardItemTemplate(rewardItemTemplateID: UInt32, name: String?, description: String?, image: String?) {
            BasicBeastsNFTStakingRewards.rewardItemTemplates[rewardItemTemplateID] = RewardItemTemplate(rewardItemTemplateID: rewardItemTemplateID, name: name, description: description, image: image)
            emit RewardItemTemplateCreated(rewardItemTemplateID: rewardItemTemplateID, name: name, description: description, image: image)
        }

        pub fun createNewAdmin(): @Admin {
            return <-create Admin()
        }
    }

    //TODO: Test these functions
    
    access(account) fun addReward(nftID: UInt64, rewardItemTemplateID: UInt32) {
        var newRewardItem = RewardItem(rewardItemTemplateID: rewardItemTemplateID)

        BasicBeastsNFTStakingRewards.totalSupply = BasicBeastsNFTStakingRewards.totalSupply + 1

        if let rewardItems = BasicBeastsNFTStakingRewards.rewards[nftID] { //if NFT has rewards
            rewardItems[newRewardItem.id] = newRewardItem
            BasicBeastsNFTStakingRewards.rewards[nftID] = rewardItems
        } else { //if NFT does not have rewards
            BasicBeastsNFTStakingRewards.rewards[nftID] = {newRewardItem.id: newRewardItem}
        }

        emit RewardItemAdded(nftID: nftID, rewardItemID: newRewardItem.id, rewardItemTemplateID: rewardItemTemplateID)
    }

    access(account) fun removeReward(nftID: UInt64, rewardItemID: UInt32) {
        if let rewardItems = BasicBeastsNFTStakingRewards.rewards[nftID] {
            if rewardItems[rewardItemID] != nil {
                let rewardItem = rewardItems[rewardItemID]!
                let rewardItemTemplateID = rewardItem.rewardItemTemplateID
                        
                rewardItems.remove(key: rewardItemID)
                BasicBeastsNFTStakingRewards.rewards[nftID] = rewardItems // Re-assign modified dictionary back
                
                BasicBeastsNFTStakingRewards.burned = BasicBeastsNFTStakingRewards.burned + 1
                emit RewardItemRemoved(nftID: nftID, rewardItemID: rewardItemID, rewardItemTemplateID: rewardItemTemplateID)
            }
        }
    }

    access(account) fun moveReward(fromID: UInt64, toID: UInt64, rewardItemID: UInt32) {
        // Get the reward
        if let fromRewardItems = BasicBeastsNFTStakingRewards.rewards[fromID] {
            if let rewardItem = fromRewardItems[rewardItemID] {
                let rewardItemTemplateID = rewardItem.rewardItemTemplateID

                // Remove the reward from the NFT (fromID)
                fromRewardItems.remove(key: rewardItemID)
                BasicBeastsNFTStakingRewards.rewards[fromID] = fromRewardItems // Re-assign modified dictionary back

                // Add the reward to the other NFT (toID)
                if var toRewardItems = BasicBeastsNFTStakingRewards.rewards[toID] { //if NFT has rewards
                    toRewardItems[rewardItem.id] = rewardItem
                    BasicBeastsNFTStakingRewards.rewards[toID] = toRewardItems // Re-assign modified dictionary back
                } else { //if NFT does not have rewards
                    BasicBeastsNFTStakingRewards.rewards[toID] = {rewardItem.id: rewardItem}
                }

                emit RewardItemMoved(fromID: fromID, toID: toID, rewardItemID: rewardItemID, rewardItemTemplateID: rewardItemTemplateID)
            }
        }
    }

    pub fun createNewRevealer(): @Revealer {
        return <-create Revealer()
    }

    pub fun getRewardItemTemplate(id: UInt32): RewardItemTemplate? {
        return BasicBeastsNFTStakingRewards.rewardItemTemplates[id]
    }

    pub fun getAllRewardItemTemplates(): {UInt32: RewardItemTemplate} {
        return BasicBeastsNFTStakingRewards.rewardItemTemplates
    }

    pub fun getRewards(nftID: UInt64): {UInt32: RewardItem}? {
        return self.rewards[nftID]
    }

    pub fun getAllRewards(): {UInt64: {UInt32: RewardItem}} {
        return self.rewards
    }

    pub fun hasRewardItemOne(nftID: UInt64): UInt32? {
        let rewards = self.getRewards(nftID: nftID)

        if rewards != nil {
            for item in rewards!.values {
                if item.rewardItemTemplateID == 1 {
                    return item.id
                }
            }
        }
        return nil
    }

    pub fun hasRewardItemTwo(nftID: UInt64): UInt32? {
        let rewards = self.getRewards(nftID: nftID)

        if rewards != nil {
            for item in rewards!.values {
                if item.rewardItemTemplateID == 2 {
                    return item.id
                }
            }
        }
        return nil
    }

    init() {
        self.totalSupply = 0
        self.burned = 0
        self.rewardPerSecond = 604800.00 // seven days
        self.rewardItemTemplates = {
            1: RewardItemTemplate(rewardItemTemplateID: 1, name: nil, description: nil, image: nil),
            2: RewardItemTemplate(rewardItemTemplateID: 2, name: nil, description: nil, image: nil),
            3: RewardItemTemplate(rewardItemTemplateID: 3, name: nil, description: nil, image: nil),
            4: RewardItemTemplate(rewardItemTemplateID: 4, name: nil, description: nil, image: nil),
            5: RewardItemTemplate(rewardItemTemplateID: 5, name: nil, description: nil, image: nil) // best reward
        }
        self.rewards = {}

        self.RevealerStoragePath = /storage/BasicBeastsNFTStakingRewardsRevealer_2
        self.AdminStoragePath = /storage/BasicBeastsNFTStakingRewardsAdmin_2
        self.AdminPrivatePath = /private/BasicBeastsNFTStakingRewardsAdminUpgrade_2

        // Put Admin in storage
        self.account.save(<-create Admin(), to: self.AdminStoragePath)

        emit ContractInitialized()
    }
}