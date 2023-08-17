import BasicBeastsNFTStaking from "./BasicBeastsNFTStaking.cdc"
import BasicBeastsNFTStakingRewards from "./BasicBeastsNFTStakingRewards.cdc"

pub contract BasicBeastsRaids {

    pub event ContractInitialized()
    pub event PlayerOptIn(player: Address, nftID: UInt64, discordID: String)
    pub event RaidEvent(winner: UInt64?, attackerNFT: UInt64, defenderNFT: UInt64, attackerAddress: Address, defenderAddress: Address, raidRecordID: UInt32, rewardTemplateID: UInt32)
    pub event NewSeasonStarted(newCurrentSeason: UInt32)

    pub let GameMasterStoragePath: StoragePath
    pub let GameMasterPrivatePath: PrivatePath
    pub let PlayerStoragePath: StoragePath

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
        pub let attackerNFT: UInt64
        pub let defenderNFT: UInt64
        pub let attackerAddress: Address
        pub let defenderAddress: Address
        pub let winner: UInt64?
        pub let season: UInt32
        pub let attackerPointsAwarded: UInt32
        pub let defenderPointsAwarded: UInt32
        pub let rewardTemplateID: UInt32

        init(id: UInt32, attackerNFT: UInt64, defenderNFT: UInt64, attackerAddress: Address, defenderAddress: Address, winner: UInt64?, attackerPointsAwarded: UInt32, defenderPointsAwarded: UInt32, rewardTemplateID: UInt32) {
            self.id = id
            self.attackerNFT = attackerNFT
            self.defenderNFT = defenderNFT
            self.attackerAddress = attackerAddress
            self.defenderAddress = defenderAddress
            self.winner = winner
            self.season = BasicBeastsRaids.currentSeason
            self.attackerPointsAwarded = attackerPointsAwarded
            self.defenderPointsAwarded = defenderPointsAwarded
            self.rewardTemplateID = rewardTemplateID
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
                // check if player has raided in the last 3 hours
                if(currentTimestamp - playerLockStartDate <= 10800.00) {
                    panic("Cannot opt out, player has raided in the last 3 hours")
                }
            }
            BasicBeastsRaids.playerOptIns.remove(key: self.owner!.address)
        }

    }

    // calls functions on player's behalf
    pub resource GameMaster {

        pub fun randomRaid(attacker: Address) {
            // check if attacker is valid
            if(BasicBeastsRaids.playerOptIns.keys.contains(attacker)) { //todo: tested
                // check cooldown
                if BasicBeastsRaids.canAttack(attacker: attacker) { //todo: tested
                    // fetch attacker's nft
                    if let attackerNftID = BasicBeastsRaids.playerOptIns[attacker] { //todo: tested
                        // pick a reward from the attacker
                        var attackerRewardID: UInt32? = nil
                        
                        // check rewards
                        let hasRewardOne = BasicBeastsNFTStakingRewards.hasRewardItemOne(nftID: attackerNftID)
                        let hasRewardTwo = BasicBeastsNFTStakingRewards.hasRewardItemTwo(nftID: attackerNftID)

                        // pick attacker reward
                        if hasRewardOne != nil && hasRewardTwo != nil { //todo: tested
                            let randomReward = BasicBeastsRaids.chooseRewardOneOrTwo()
                            attackerRewardID = (randomReward == 2) ? hasRewardTwo : hasRewardOne
                        } else if hasRewardTwo != nil {
                            attackerRewardID = hasRewardTwo
                        } else {
                            attackerRewardID = hasRewardOne
                        }

                        if(attackerRewardID != nil) {
                            // find a random defender
                            var defenderAddress: Address? = nil
                            var defenderRewardID: UInt32? = nil
                            var defenderNftID: UInt64? = nil

                            let allPlayers = BasicBeastsRaids.playerOptIns.keys
                            let shuffledPlayers = BasicBeastsRaids.shuffle(addresses: allPlayers)

                            for potentialDefender in shuffledPlayers { //todo: tested
                                if potentialDefender != attacker {
                                    defenderNftID = BasicBeastsRaids.playerOptIns[potentialDefender]

                                    if defenderNftID != nil {
                                        // check rewards and break if found
                                        let defenderRewardOne = BasicBeastsNFTStakingRewards.hasRewardItemOne(nftID: defenderNftID!)
                                        let defenderRewardTwo = BasicBeastsNFTStakingRewards.hasRewardItemTwo(nftID: defenderNftID!)

                                        if(hasRewardOne == attackerRewardID && defenderRewardOne != nil) {
                                            defenderRewardID = defenderRewardOne
                                            defenderAddress = potentialDefender
                                            break
                                        } else if (hasRewardTwo == attackerRewardID && defenderRewardTwo != nil) {
                                            defenderRewardID = defenderRewardTwo
                                            defenderAddress = potentialDefender
                                            break
                                        }
                                    }

                                }
                            }

                            if(defenderRewardID != nil) {
                                // run the raid algo
                                let raidResult = BasicBeastsRaids.pickRaidWinner()
                                var winner: UInt64? = nil
                                var attackerPointCount: UInt32 = 0
                                var defenderPointCount: UInt32 = 0

                                // 1 point = rewardItemOne, 3 points = rewardItemTwo
                                var additionalPoints: UInt32 = hasRewardTwo == attackerRewardID ? 3 : 1

                                if(raidResult == 0) {
                                    // tie, the reward gets burned
                                    BasicBeastsNFTStakingRewards.removeReward(nftID: attackerNftID, rewardItemID: attackerRewardID!)
                                } else if (raidResult == 1) {
                                    // attacker wins
                                    winner = attackerNftID
                                    // award reward to attacker
                                    BasicBeastsNFTStakingRewards.moveReward(fromID: defenderNftID!, toID: attackerNftID, rewardItemID: defenderRewardID!)
                                    // award additional points to attacker for winning
                                    BasicBeastsRaids.awardPoint(nftID: attackerNftID, numOfPoints: additionalPoints)
                                    attackerPointCount = attackerPointCount + additionalPoints
                                } else if (raidResult == 2) {
                                    // defender wins
                                    winner = defenderNftID
                                    // award reward to defender
                                    BasicBeastsNFTStakingRewards.moveReward(fromID: attackerNftID, toID: defenderNftID!, rewardItemID: attackerRewardID!)
                                    // award addtional points to defender for winning
                                    BasicBeastsRaids.awardPoint(nftID: defenderNftID!, numOfPoints: additionalPoints)
                                    defenderPointCount = defenderPointCount + additionalPoints
                                }
                                // award 1 point and exp to each for raiding
                                BasicBeastsRaids.awardPoint(nftID: attackerNftID, numOfPoints: 1)
                                attackerPointCount = attackerPointCount + 1
                                BasicBeastsRaids.awardExp(nftID: attackerNftID)

                                BasicBeastsRaids.awardPoint(nftID: defenderNftID!, numOfPoints: 1)
                                defenderPointCount = defenderPointCount + 1
                                BasicBeastsRaids.awardExp(nftID: defenderNftID!)
                                
                                // create record
                                BasicBeastsRaids.raidCount = BasicBeastsRaids.raidCount + 1
                                BasicBeastsRaids.raidRecords[BasicBeastsRaids.raidCount] = RaidRecord(id: BasicBeastsRaids.raidCount, 
                                                                                                    attackerNFT: attackerNftID, 
                                                                                                    defenderNFT: defenderNftID!, 
                                                                                                    attackerAddress: attacker, 
                                                                                                    defenderAddress: defenderAddress!, 
                                                                                                    winner: winner, 
                                                                                                    attackerPointsAwarded: attackerPointCount,
                                                                                                    defenderPointsAwarded: defenderPointCount,
                                                                                                    rewardTemplateID: hasRewardTwo == attackerRewardID ? 2 : 1)

                                // add cooldown
                                BasicBeastsRaids.updateCooldownTimestamps(address: attacker, nftID: attackerNftID)

                                // start lock timer
                                BasicBeastsRaids.playerLockStartDates[attacker] = getCurrentBlock().timestamp

                                emit RaidEvent(winner: winner, 
                                            attackerNFT: attackerNftID, 
                                            defenderNFT: defenderNftID!, 
                                            attackerAddress: attacker, 
                                            defenderAddress: defenderAddress!, 
                                            raidRecordID: BasicBeastsRaids.raidCount,
                                            rewardTemplateID: hasRewardTwo == attackerRewardID ? 2 : 1)

                            }
                            // no raid, no defender with valid rewards were found
                        }
                        // no raid, nft has no valid rewards
                    }
                    // no raid, nft could not be found
                }
                // no raid, player cannot attack
            }
            // no raid, player has not opted in 
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
                    BasicBeastsRaids.raidRecords[BasicBeastsRaids.raidCount] = RaidRecord(id: BasicBeastsRaids.raidCount, 
                                                                                        attackerNFT: attackerNftID, 
                                                                                        defenderNFT: defenderNftID, 
                                                                                        attackerAddress: attacker,
                                                                                        defenderAddress: defender,
                                                                                        winner: winner, 
                                                                                        attackerPointsAwarded: 0,
                                                                                        defenderPointsAwarded: 0,
                                                                                        rewardTemplateID: aHasRewardTwo == attackerRewardID ? 2 : 1)

                    // add cooldown
                    BasicBeastsRaids.updateCooldownTimestamps(address: attacker, nftID: attackerNftID)

                    // start lock timer
                    BasicBeastsRaids.playerLockStartDates[attacker] = getCurrentBlock().timestamp

                }
            }


            
        }

        pub fun removePlayer(player: Address) {
            BasicBeastsRaids.playerOptIns.remove(key: player)
        }

        pub fun optOutPlayer(player: Address): Bool {
            let currentTimestamp = getCurrentBlock().timestamp
            if let playerLockStartDate = BasicBeastsRaids.playerLockStartDates[player] {
                // check if player has raided in the last 3 hours
                if(currentTimestamp - playerLockStartDate <= 10800.00) {
                    return false
                }
            }
            BasicBeastsRaids.playerOptIns.remove(key: player)
            return true
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

    access(contract) fun awardPoint(nftID: UInt64, numOfPoints: UInt32) {
        var currentSeasonPoints = BasicBeastsRaids.points[BasicBeastsRaids.currentSeason] ?? {}

        if(currentSeasonPoints[nftID] != nil) {
            currentSeasonPoints[nftID] = currentSeasonPoints[nftID]! + numOfPoints
        } else {
            currentSeasonPoints[nftID] = numOfPoints
        }

        // save the updated currentSeasonPoints back to the points dictionary
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
        // fetch the current timestamp
        let timestamp = getCurrentBlock().timestamp

        // get or create the dictionary for the address
        var innerDict = self.attackerCooldownTimestamps[address] ?? {}

        // check if the nftID exists for the given address and update timestamps
        var timestamps = innerDict[nftID] ?? []
        while timestamps.length >= 9 {
            timestamps.remove(at: 0)
        }
        timestamps.append(timestamp)
        
        // update the inner dictionary
        innerDict[nftID] = timestamps

        // assign the updated inner dictionary back to the main dictionary
        self.attackerCooldownTimestamps[address] = innerDict
    }

    pub fun shuffle(addresses: [Address]): [Address] {
        var shuffled: [Address] = []
        var input = addresses
        while input.length > 0 {
            let randomIndex = unsafeRandom() % UInt64(input.length)
            shuffled.append(input.remove(at: randomIndex))
        }
        return shuffled
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
        let SECONDS_IN_A_DAY: UFix64 = 86400.00
        let MAX_ATTACKS_IN_DAY: Int = 9
        
        // check if the attacker has opted-in
        if let nftID = self.playerOptIns[attacker] {
            // check if the attacker has cooldowns
            if let nftCooldowns = self.attackerCooldownTimestamps[attacker] {
                let currentTimestamp = getCurrentBlock().timestamp

                // check for the specific NFT's cooldowns
                if let previousTimestamps = nftCooldowns[nftID] {
                    // count recent attacks
                    var recentAttacksCount = 0
                    // if the difference between the current timestamp and the stored timestamp is less than 24 hours,
                    // increment the attacksOnCooldown counter
                    for timestamp in previousTimestamps {
                        if currentTimestamp - timestamp < SECONDS_IN_A_DAY {
                            recentAttacksCount = recentAttacksCount + 1
                        }
                    }

                    // return whether the attacker can attack based on recent attacks count
                    return recentAttacksCount < MAX_ATTACKS_IN_DAY
                }
                // if there's no specific record for the NFT's cooldowns, then it can attack
                return true
            }
            // if the attacker has no cooldowns, then it can attack
            return true
        }
        // if there's no opt-in, then it cannot attack
        return false
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
        // generate a random number between 0 and 100_000_000
        let randomNum = Int(unsafeRandom() % 100_000_000)

        // define the threshold based on 20% probability scaled up by 1_000_000
        let threshold = 20_000_000

        // return reward 2 if the random number is below the threshold (20% chance)
        // otherwise return reward 1 (80% chance)
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
        // generate a random number between 0 and 100_000_000
        let randomNum = Int(unsafeRandom() % 100_000_000)
        
        let threshold1 = 45_000_000 // for 45%
        let threshold2 = 93_100_000 // for 48.1%, cumulative 93.1%
        
        // return reward based on generated random number
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

    pub fun getRaidRecord(recordID: UInt32): RaidRecord? {
        return self.raidRecords[recordID]
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
        self.PlayerStoragePath = /storage/BasicBeastsRaidsPlayer_1

        // Put Game Master in storage
        self.account.save(<-create GameMaster(), to: self.GameMasterStoragePath)

        emit ContractInitialized()
    }
}