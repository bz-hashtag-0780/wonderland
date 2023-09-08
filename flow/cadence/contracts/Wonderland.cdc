import NonFungibleToken from "./utility/NonFungibleToken.cdc"
import FungibleToken from "./utility/FungibleToken.cdc"
import CleoCoin from "./CleoCoin.cdc"
import Deedz from "./Deedz.cdc"

access(all) contract Wonderland {

    access(all) event ContractInitialized()

    access(all) let MAX_SUPPLY: UInt64
    access(all) let TERRITORY_LIMIT_PER_WORLD: Int

    access(all) var totalSupply: UInt64
    access(all) var totalTerritories: UInt32
    access(self) var worlds: @{UInt64: World}
    access(self) let coinRequirement: {UInt64:UFix64}

    access(all) resource Territory {
        access(all) let id: UInt32
        access(self) let coins: @CleoCoin.Minter
        // future farmable resources
        access(self) var farmableResources: @{String:AnyResource} //todo: figure out how farming will work with either this solution or something else.
        // any future metadata
        access(self) var metadata: {String:AnyStruct}

        // fields controlled by deedz holder
        access(self) var name: String?
        access(self) var expeditionFees: UFix64
        access(self) var coinReceiver: Capability<&CleoCoin.Vault{FungibleToken.Receiver}>?

        init(minter: @CleoCoin.Minter) {
            self.id = Wonderland.totalTerritories
            self.coins <- minter
            self.name = nil
            self.expeditionFees = 0.0
            self.coinReceiver = nil
            self.farmableResources <- {}
            self.metadata = {}

            Wonderland.totalTerritories = Wonderland.totalTerritories + 1
        }

        //todo: add all getters and setters
        // Set name of territory once
        access(all) fun setName(name: String, deedz: @Deedz.NFT): @Deedz.NFT {
            pre {
                self.name == nil : "Cannot set name of territory: Name has already been set."
                deedz.territoryID == self.id : "Cannot set name of territory: Deedz does not match territory."
            }
            self.name = name
            return <- deedz
        }

        access(all) fun setExpeditionFees(fees: UFix64, deedz: @Deedz.NFT): @Deedz.NFT {
            pre {
                deedz.territoryID == self.id : "Cannot set expedition fees: Deedz does not match territory."
            }
            self.expeditionFees = fees
            return <- deedz
        }

        access(all) fun setCoinReceiver(receiver: Capability<&CleoCoin.Vault{FungibleToken.Receiver}>, deedz: @Deedz.NFT): @Deedz.NFT {
            pre {
                deedz.territoryID == self.id : "Cannot set coin receiver: Deedz does not match territory."
            }
            self.coinReceiver = receiver
            return <- deedz
        }

        access(all) fun getName(): String? {
            return self.name
        }

        access(all) fun getExpeditionFees(): UFix64 {
            return self.expeditionFees
        }

        access(all) fun getAllMetadata(): {String:AnyStruct} {
            return self.metadata
        }

        access(all) fun getMetadata(key: String): AnyStruct? {
            return self.metadata[key]
        }

        destroy() {
            destroy self.coins
            destroy self.farmableResources
        }
    }

    access(all) resource World {
        access(all) let id: UInt64
        access(self) var territories: @{UInt32:Territory}

        init(territories: @{UInt32:Territory}) {
            self.id = Wonderland.totalSupply

            self.territories <- territories

            Wonderland.totalSupply = Wonderland.totalSupply + 1
        }

        access(all) fun borrowTerritory(id: UInt32): &Wonderland.Territory? {
            return &self.territories[id] as &Wonderland.Territory?
        }

        destroy() {
            destroy self.territories
        }
    }

    // -----------------------------------------------------------------------
    // interim admin resource controlled by BB Club DAO
    // -----------------------------------------------------------------------
    access(all) resource BBClubDAO {
        access(all) fun addNewFarmableResource() {}
    }

    // -----------------------------------------------------------------------
    // access(account) functions
    // -----------------------------------------------------------------------


    // -----------------------------------------------------------------------
    // public contract functions
    // -----------------------------------------------------------------------
    access(all) fun mintNewWonderland(cleoCoinVault: @CleoCoin.Vault): @NonFungibleToken.Collection {
        pre {
            Wonderland.totalSupply < Wonderland.MAX_SUPPLY : "Cannot mint new Wonderland: Max supply has been reached."
            cleoCoinVault.balance == Wonderland.coinRequirement[Wonderland.totalSupply] : "Cannot mint new Wonderland: Need exact amount of Cleo Coins required"
        }

        let territories: @{UInt32:Territory} <- {}

        let deedz <- Deedz.createEmptyCollection()

        var i = 0
        while i < Wonderland.TERRITORY_LIMIT_PER_WORLD {
            let newID = Wonderland.totalTerritories

            // create new Territory
            territories[newID] <-! create Territory(minter: <- CleoCoin.createMinter())

            // create new Deedz
            let newDeedz <- Deedz.mintDeedz(worldID: self.totalSupply, territoryID: newID)
            deedz.deposit(token: <-newDeedz)

            i = i + 1
        }

        // create new World
        let newWorld <- create World(territories: <-territories)
        self.worlds[self.totalSupply] <-! newWorld

        // burn Cleo Coins
        destroy cleoCoinVault

        return <- deedz
    }

    access(all) fun nameWorld(name: String, deedz: @Deedz.NFT): @Deedz.NFT {
        if let worldRef = self.borrowWorld(id: deedz.worldID) {
            if let territoryRef = worldRef.borrowTerritory(id: deedz.territoryID) {
                return <- territoryRef.setName(name: name, deedz: <- deedz)
            }
        }
        return <- deedz
    }

    access(all) fun setExpeditionFees(fees: UFix64, deedz: @Deedz.NFT): @Deedz.NFT {
        if let worldRef = self.borrowWorld(id: deedz.worldID) {
            if let territoryRef = worldRef.borrowTerritory(id: deedz.territoryID) {
                return <- territoryRef.setExpeditionFees(fees: fees, deedz: <- deedz)
            }
        }
        return <- deedz
    }

    access(all) fun setCoinReceiver(receiver: Capability<&CleoCoin.Vault{FungibleToken.Receiver}>, deedz: @Deedz.NFT): @Deedz.NFT {
        if let worldRef = self.borrowWorld(id: deedz.worldID) {
            if let territoryRef = worldRef.borrowTerritory(id: deedz.territoryID) {
                return <- territoryRef.setCoinReceiver(receiver: receiver, deedz: <- deedz)
            }
        }
        return <- deedz
    }

    access(all) fun borrowWorld(id: UInt64): &Wonderland.World? {
        return &self.worlds[id] as &Wonderland.World?
    }

    init() {
        self.MAX_SUPPLY = 10
        self.TERRITORY_LIMIT_PER_WORLD = 10

        self.totalSupply = 0
        self.totalTerritories = 0
        self.worlds <- {}
        self.coinRequirement = {
            0: 0.0,
            1: 69_000.0,
            2: 420_000.0,
            3: 690_000.0,
            4: 4_200_000.0,
            5: 6_900_000.0,
            6: 42_000_000.0,
            7: 69_000_000.0,
            8: 420_000_000.0,
            9: 690_000_000.0
        }

        //todo: mint genesis wonderland 

        emit ContractInitialized()
    }

}