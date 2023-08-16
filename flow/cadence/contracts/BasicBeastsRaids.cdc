import BasicBeastsNFTStaking from "./BasicBeastsNFTStaking.cdc"
import BasicBeastsNFTStakingRewards from "./BasicBeastsNFTStakingRewards.cdc"

pub contract BasicBeastsRaids {

    pub event ContractInitialized()
    pub event PlayerOptIn(player: Address, nftID: UInt64, discordID: String)
    pub event NewSeasonStarted(newCurrentSeason: UInt32)

    pub let GameMasterStoragePath: StoragePath
    pub let GameMasterPrivatePath: PrivatePath

    pub var currentSeason: UInt32
    pub var raidCount: UInt32
    pub var raidsPaused: Bool
    access(self) var raidRecords: {UInt32: RaidRecord}
    access(self) var playerOptIns: {Address: UInt64}
    access(self) var addressToDiscord: {Address: String}
    access(self) var playerLockStartDates: {Address: UFix64}
    access(self) var points: {UInt32: {UInt64: UInt32}} // {season: {nftID: points}}
    access(self) var exp: {UInt64: UInt32}
    access(self) var attackerCooldownTimestamps: {Address: {UInt64: [UFix64]}}

    pub struct RaidRecord {
        pub let id: UInt32
        pub let attacker: UInt64
        pub let defender: UInt64
        pub let winner: UInt64?
        pub let season: UInt32
        pub let pointsAwarded: UInt32

        init(id: UInt32, attacker: UInt64, defender: UInt64, winner: UInt64?, pointsAwarded: UInt32) {
            self.id = id
            self.attacker = attacker
            self.defender = defender
            self.winner = winner
            self.season = BasicBeastsRaids.currentSeason
            self.pointsAwarded = pointsAwarded
        }
    }

    pub resource Player {
        pub fun optIn(nftID: UInt64, discordID: String) {
            
            // check if player has the nft in the staking collection
            let playerAddress = self.owner!.address

            var collectionRef:&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}?  = nil
            
            if let cap = getAccount(playerAddress).capabilities.get<&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}>(BasicBeastsNFTStaking.CollectionPublicPath) {
                collectionRef = cap.borrow()
            }

            if(collectionRef != nil) {
                let IDs = collectionRef!.getIDs()
                assert(IDs.contains(nftID), message: "This address does not hold the NFT")
            }
            
            // check if player has valid rewards
            if(BasicBeastsNFTStakingRewards.hasRewardItemOne(nftID: nftID) != nil || BasicBeastsNFTStakingRewards.hasRewardItemTwo(nftID: nftID) != nil) {
                BasicBeastsRaids.playerOptIns[playerAddress] = nftID

                BasicBeastsRaids.addressToDiscord[playerAddress] = discordID

                emit PlayerOptIn(player: playerAddress, nftID: nftID, discordID: discordID)
            }
        }

        pub fun optOut() {
            let currentTimestamp = getCurrentBlock().timestamp
            if let playerLockStartDate = BasicBeastsRaids.playerLockStartDates[self.owner!.address] {
                // check if player has not raided in the last 3 hours
                if(currentTimestamp - playerLockStartDate > 10800.00) {
                    BasicBeastsRaids.playerOptIns.remove(key: self.owner!.address)
                }
            }
        }

    }

    // Calls functions on player's behalf
    pub resource GameMaster {

        // No pre-condition to allow running multiple random raids in a single transaction
        pub fun randomRaid(attacker: Address) {
            // check if attacker is valid
            if(BasicBeastsRaids.playerOptIns.keys.contains(attacker)) {
                //check cooldown
                if BasicBeastsRaids.canAttack(attacker: attacker) {
                    // fetch attacker's nft
                    if let nftID = BasicBeastsRaids.playerOptIns[attacker] {
                        // pick a reward from the attacker
                        var attackerRewardID: UInt32? = nil
                        
                        // check rewards
                        let hasRewardOne = BasicBeastsNFTStakingRewards.hasRewardItemOne(nftID: nftID)
                        let hasRewardTwo = BasicBeastsNFTStakingRewards.hasRewardItemTwo(nftID: nftID)

                        // pick reward
                        if hasRewardOne != nil || hasRewardTwo != nil {
                            let randomReward = BasicBeastsRaids.chooseRewardOneOrTwo()
                            attackerRewardID = (randomReward == 2 && hasRewardTwo != nil) ? hasRewardTwo : hasRewardOne
                        }

                        if(attackerRewardID != nil) {
                            // find a random defender
                            var defenderFound = false
                            var randomDefender: Address? = nil
                            var defenderRewardID: UInt32? = nil
                            var defenderNftID: UInt64? = nil

                            while !defenderFound {
                                randomDefender = BasicBeastsRaids.pickRandomPlayer()
                                defenderNftID = BasicBeastsRaids.playerOptIns[randomDefender!]
                                
                                if(defenderNftID != nil) {
                                    // make sure defender is not attacker
                                    if(randomDefender! != attacker) {
                                        // check if defender has valid matching reward
                                        if(hasRewardOne == attackerRewardID) {
                                            defenderRewardID = BasicBeastsNFTStakingRewards.hasRewardItemOne(nftID: defenderNftID!)
                                            defenderFound = true
                                        } else if (hasRewardTwo == attackerRewardID) {
                                            defenderRewardID = BasicBeastsNFTStakingRewards.hasRewardItemTwo(nftID: defenderNftID!)
                                            defenderFound = true
                                        }
                                    }
                                }
                            }

                            if(defenderFound && defenderRewardID != nil) {
                                // run the raid algo
                                let raidResult = BasicBeastsRaids.pickRaidWinner()
                                var winner: UInt64? = nil
                                var pointCount: UInt32 = 0
                                if(raidResult == 0) {
                                    // tie, the reward gets burned
                                    BasicBeastsNFTStakingRewards.removeReward(nftID: nftID, rewardItemID: attackerRewardID!)
                                } else if (raidResult == 1) {
                                    // attacker wins
                                    winner = nftID
                                    // award reward to attacker
                                    BasicBeastsNFTStakingRewards.moveReward(fromID: defenderNftID!, toID: nftID, rewardItemID: defenderRewardID!)
                                    // award additional point to attacker
                                    BasicBeastsRaids.awardPoint(nftID: nftID)
                                    pointCount = pointCount + 1
                                } else if (raidResult == 2) {
                                    // defender wins
                                    winner = defenderNftID
                                    // award reward to defender
                                    BasicBeastsNFTStakingRewards.moveReward(fromID: nftID, toID: defenderNftID!, rewardItemID: attackerRewardID!)
                                    // award point to defender
                                    BasicBeastsRaids.awardPoint(nftID: defenderNftID!)
                                    pointCount = pointCount + 1
                                }
                                // award point and exp to attacker for raiding
                                BasicBeastsRaids.awardPoint(nftID: nftID)
                                pointCount = pointCount + 1
                                BasicBeastsRaids.awardExp(nftID: nftID)
                                
                                // create record
                                BasicBeastsRaids.raidCount = BasicBeastsRaids.raidCount + 1
                                BasicBeastsRaids.raidRecords[BasicBeastsRaids.raidCount] = RaidRecord(id: BasicBeastsRaids.raidCount, attacker: nftID, defender: defenderNftID!, winner: winner, pointsAwarded: pointCount)

                                // add cooldown
                                BasicBeastsRaids.updateCooldownTimestamps(address: attacker, nftID: nftID)

                                // start lock timer
                                BasicBeastsRaids.playerLockStartDates[attacker] = getCurrentBlock().timestamp

                            }
                        }
                    }
                }
            }
        }

        // no points nor exp is awarded from this type of raid
        pub fun targetedRaid(attacker: Address, defender: Address) {
            pre {
                attacker != defender: "Can't do targeted raid: attacker and defender is the same"
                BasicBeastsRaids.playerOptIns.keys.contains(defender): "Can't do targeted raid: defender has not opted in"
                BasicBeastsRaids.playerOptIns.keys.contains(attacker): "Can't do targeted raid: attacker has not opted in"
                BasicBeastsRaids.canAttack(attacker: attacker): "Can't do targeted raid: attacker is on cooldown"
            }
            // fetch attacker's nft
            if let attackerNftID = BasicBeastsRaids.playerOptIns[attacker] {
                // check if attacker has nft or is setup correctly
                assert(BasicBeastsRaids.hasNFT(address: attacker, nftID: attackerNftID) ,message: "Can't do targeted raid: attacker nft is not setup correctly")
                // fetch defender's nft
                if let defenderNftID = BasicBeastsRaids.playerOptIns[defender] {
                    // check if defender has nft or is setup correctly
                    assert(BasicBeastsRaids.hasNFT(address: defender, nftID: defenderNftID) ,message: "Can't do targeted raid: defender nft is not setup correctly")
                    

                    // check attacker rewards
                    let aHasRewardOne = BasicBeastsNFTStakingRewards.hasRewardItemOne(nftID: attackerNftID)
                    let aHasRewardTwo = BasicBeastsNFTStakingRewards.hasRewardItemTwo(nftID: attackerNftID)
                    assert(aHasRewardOne!=nil||aHasRewardTwo!=nil, message: "Can't do targeted raid: attacker has no valid rewards")

                    // check attacker rewards
                    let dHasRewardOne = BasicBeastsNFTStakingRewards.hasRewardItemOne(nftID: defenderNftID)
                    let dHasRewardTwo = BasicBeastsNFTStakingRewards.hasRewardItemTwo(nftID: defenderNftID)
                    assert(dHasRewardOne!=nil||dHasRewardTwo!=nil, message: "Can't do targeted raid: defender has no valid rewards")

                    // check matching rewards
                    assert(aHasRewardOne!=nil && dHasRewardOne!=nil ||
                            aHasRewardTwo!=nil && dHasRewardTwo!=nil,
                            message: "Can't do targeted raid: attacker and defender has no matching rewards")
                    
                    // fetch reward from attacker and defender
                    var attackerRewardID: UInt32? = nil
                    var defenderRewardID: UInt32? = nil

                    // prioritize reward one
                    if(aHasRewardOne!=nil && dHasRewardOne!=nil) {
                        attackerRewardID = aHasRewardOne
                        defenderRewardID = dHasRewardOne
                    } else {
                        attackerRewardID = aHasRewardTwo
                        defenderRewardID = dHasRewardTwo
                    }

                    // run the raid algo
                    let raidResult = BasicBeastsRaids.pickRaidWinner()
                    var winner: UInt64? = nil
                    if(raidResult == 0) {
                        // tie, the reward gets burned
                        BasicBeastsNFTStakingRewards.removeReward(nftID: attackerNftID, rewardItemID: attackerRewardID!)
                    } else if (raidResult == 1) {
                        // attacker wins
                        winner = attackerNftID
                        // award reward to attacker
                        BasicBeastsNFTStakingRewards.moveReward(fromID: defenderNftID, toID: attackerNftID, rewardItemID: defenderRewardID!)
                    } else if (raidResult == 2) {
                        // defender wins
                        winner = defenderNftID
                        // award reward to defender
                        BasicBeastsNFTStakingRewards.moveReward(fromID: attackerNftID, toID: defenderNftID, rewardItemID: attackerRewardID!)
                    }

                    // create record
                    BasicBeastsRaids.raidCount = BasicBeastsRaids.raidCount + 1
                    BasicBeastsRaids.raidRecords[BasicBeastsRaids.raidCount] = RaidRecord(id: BasicBeastsRaids.raidCount, attacker: attackerNftID, defender: defenderNftID, winner: winner, pointsAwarded: 1)

                    // add cooldown
                    BasicBeastsRaids.updateCooldownTimestamps(address: attacker, nftID: attackerNftID)

                    // start lock timer
                    BasicBeastsRaids.playerLockStartDates[attacker] = getCurrentBlock().timestamp

                }
            }


            
        }

        pub fun removePlayer(player: Address) {
            // no pre-conditions to allow for removal of multiple players
            let currentTimestamp = getCurrentBlock().timestamp
            if let playerLockStartDate = BasicBeastsRaids.playerLockStartDates[player] {
                // check if player has not raided in the last 3 hours
                if(currentTimestamp - playerLockStartDate > 10800.00) {
                    BasicBeastsRaids.playerOptIns.remove(key: player)
                }
            }
        
        }

        pub fun createNewGameMaster(): @GameMaster {
            return <-create GameMaster()
        }

        pub fun startNewSeason() {
            BasicBeastsRaids.currentSeason = BasicBeastsRaids.currentSeason + 1
            BasicBeastsRaids.points[BasicBeastsRaids.currentSeason] = {}

            emit NewSeasonStarted(newCurrentSeason: BasicBeastsRaids.currentSeason)
        }

        pub fun pauseRaids() {
            BasicBeastsRaids.raidsPaused = true
        }

        pub fun unpauseRaids() {
            BasicBeastsRaids.raidsPaused = false
        }

    }

    access(contract) fun awardPoint(nftID: UInt64) {
        var currentSeasonPoints = BasicBeastsRaids.points[BasicBeastsRaids.currentSeason] ?? {}

        if(currentSeasonPoints[nftID] != nil) {
            currentSeasonPoints[nftID] = currentSeasonPoints[nftID]! + 1
        } else {
            currentSeasonPoints[nftID] = 1
        }

        // Save the updated currentSeasonPoints back to the points dictionary
        BasicBeastsRaids.points[BasicBeastsRaids.currentSeason] = currentSeasonPoints
    }

    access(contract) fun awardExp(nftID: UInt64) {
        if(BasicBeastsRaids.exp[nftID] != nil) {
            BasicBeastsRaids.exp[nftID] = BasicBeastsRaids.exp[nftID]! + 1
        } else {
            BasicBeastsRaids.exp[nftID] = 1
        }
    }

    access(contract) fun updateCooldownTimestamps(address: Address, nftID: UInt64) {
        // Fetch the current timestamp
        let timestamp = getCurrentBlock().timestamp

        // Get or create the dictionary for the address
        var innerDict = self.attackerCooldownTimestamps[address] ?? {}

        // Check if the nftID exists for the given address and update timestamps
        var timestamps = innerDict[nftID] ?? []
        while timestamps.length >= 9 {
            timestamps.remove(at: 0)
        }
        timestamps.append(timestamp)
        
        // Update the inner dictionary
        innerDict[nftID] = timestamps

        // Assign the updated inner dictionary back to the main dictionary
        self.attackerCooldownTimestamps[address] = innerDict
    }

    pub fun hasNFT(address: Address, nftID: UInt64): Bool {
        var collectionRef:&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}?  = nil
            
        if let cap = getAccount(address).capabilities.get<&BasicBeastsNFTStaking.Collection{BasicBeastsNFTStaking.NFTStakingCollectionPublic}>(BasicBeastsNFTStaking.CollectionPublicPath) {
            collectionRef = cap.borrow()
        }

        if(collectionRef != nil) {
            let IDs = collectionRef!.getIDs()
            if(IDs.contains(nftID)) {
                return true
            }
        }

        return false
    }

    pub fun canAttack(attacker: Address): Bool {
        if let nftID = self.playerOptIns[attacker] {

            if let nftCooldowns = self.attackerCooldownTimestamps[attacker] {

                let currentTimestamp = getCurrentBlock().timestamp

                if let previousTimestamps = nftCooldowns[nftID] {
                    // Check if the attacker has attacked more than 9 times in the last 24 hours
                    var attacksOnCooldown = 0
                    // If the difference between the current timestamp and the stored timestamp is less than 24 hours,
                    // increment the attacksOnCooldown counter
                    for timestamp in previousTimestamps {
                        if currentTimestamp - timestamp < 86400.00 {
                            attacksOnCooldown = attacksOnCooldown + 1
                        }
                    }
                    if attacksOnCooldown >= 9 {
                        return false
                    }
                }

            } else {
                return true // no cooldowns means it can attack
            }
        } 

        return false // no opt in, cannot attack
    }

    pub fun nextAttack(attacker: Address): UFix64? {
        if let nftID = self.playerOptIns[attacker] {
            if let nftCooldowns = self.attackerCooldownTimestamps[attacker] {
                if let previousTimestamps = nftCooldowns[nftID] {
                    if(previousTimestamps.length>0) {
                        return getCurrentBlock().timestamp - previousTimestamps[0]
                    }
                }
            }
        }
        return nil
    }

    pub fun chooseRewardOneOrTwo(): UInt32 {
        // Generate a random number between 0 and 100_000_000
        let randomNum = Int(unsafeRandom() % 100_000_000)

        // Define the threshold based on 20% probability scaled up by 1_000_000
        let threshold = 20_000_000

        // Return reward 2 if the random number is below the threshold (20% chance)
        // Otherwise return reward 1 (80% chance)
        if randomNum < threshold { return 2 }
        else { return 1 }
    }

    pub fun pickRandomPlayer(): Address {
        let players = BasicBeastsRaids.playerOptIns.keys
        assert(players.length > 0, message: "No players available")

        let randomIndex = unsafeRandom() % UInt64(players.length)

        return players[Int(randomIndex)]
    }

    pub fun pickRaidWinner(): UInt32 {
        // 0 = tie
        // 1 = attacker wins
        // 2 = defender wins
        // Generate a random number between 0 and 100_000_000
        let randomNum = Int(unsafeRandom() % 100_000_000)
        
        let threshold1 = 45_000_000 // for 45%
        let threshold2 = 93_100_000 // for 48.1%, cumulative 93.1%
        
        // Return reward based on generated random number
        if randomNum < threshold1 { return 1 }
        else if randomNum < threshold2 { return 2 }
        else { return 0 } // for remaining 6.9%
    }

    pub fun createNewPlayer(): @Player {
        return <-create Player()
    }

    pub fun getRaidRecords(): {UInt32: RaidRecord} {
        return self.raidRecords
    }

    pub fun getPlayerOptIns(): {Address: UInt64} {
        return self.playerOptIns
    }

    pub fun getPlayerOptIn(address: Address): UInt64? {
        return self.playerOptIns[address]
    }

    pub fun getAddressToDiscords(): {Address: String} {
        return self.addressToDiscord
    }

    pub fun getAddressToDiscord(address: Address): String? {
        return self.addressToDiscord[address]
    }

    pub fun getPlayerLockStartDates(): {Address: UFix64} {
        return self.playerLockStartDates
    }

    pub fun getPoints(): {UInt32: {UInt64:UInt32}} {
        return self.points
    }

    pub fun getExp(): {UInt64: UInt32} {
        return self.exp
    }

    pub fun getAttackCooldownTimestamps(): {Address: {UInt64: [UFix64]}} {
        return self.attackerCooldownTimestamps
    }

    init() {
        self.currentSeason = 0
        self.raidCount = 0
        self.raidsPaused = false
        self.raidRecords = {}
        self.playerOptIns = {}
        self.addressToDiscord = {}
        self.playerLockStartDates = {}
        self.points = {}
        self.exp = {}
        self.attackerCooldownTimestamps = {}

        self.GameMasterStoragePath = /storage/BasicBeastsRaidsGameMaster_1
        self.GameMasterPrivatePath = /private/BasicBeastsRaidsGameMaster_1

        // Put Game Master in storage
        self.account.save(<-create GameMaster(), to: self.GameMasterStoragePath)

        emit ContractInitialized()
    }
}