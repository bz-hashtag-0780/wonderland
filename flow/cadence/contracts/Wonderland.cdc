import CleoCoin from "./CleoCoin.cdc"

pub contract Wonderland {

    pub event ContractInitialized()

    pub let MAX_SUPPLY: UInt64
    pub let TERRITORY_LIMIT_PER_WORLD: Int

    pub var totalSupply: UInt64
    pub var totalTerritories: UInt32
    access(self) var worlds: @{UInt64: World}
    access(self) let coinRequirement: {UInt64:UFix64}

    pub resource Territory {
        pub let id: UInt32
        pub let coins: @CleoCoin.Minter?
        access(self) var farmableResources: @{UInt64:AnyResource} // future farmable resources

        init() {
            self.id = Wonderland.totalTerritories
            self.coins <- nil
            self.farmableResources <- {}

            Wonderland.totalTerritories = Wonderland.totalTerritories + 1
        }

        destroy() {
            destroy self.coins
            destroy self.farmableResources
        }
    }

    pub resource World {
        pub let id: UInt64
        access(self) var territories: @{UInt32:Territory}

        init() {
            self.id = Wonderland.totalSupply

            self.territories <- {}
            var i = 0
            while i < Wonderland.TERRITORY_LIMIT_PER_WORLD {
                self.territories[Wonderland.totalTerritories] <-! create Territory()
                i = i + 1
            }

            Wonderland.totalSupply = Wonderland.totalSupply + 1
        }

        pub fun borrowTerritory(id: UInt32): &Wonderland.Territory? {
            return &self.territories[id] as &Wonderland.Territory?
        }

        destroy() {
            destroy self.territories
        }
    }

    // -----------------------------------------------------------------------
    // interim admin resource controlled by BB Club DAO
    // -----------------------------------------------------------------------
    pub resource BBClubDAO {
        pub fun addNewFarmableResource() {}
    }

    // -----------------------------------------------------------------------
    // access(account) functions
    // -----------------------------------------------------------------------
    access(account) fun nameWorld(name: String, territoryID: UInt32) {

    }

    // -----------------------------------------------------------------------
    // public contract functions
    // -----------------------------------------------------------------------
    pub fun mintNewWonderland(cleoCoinVault: @CleoCoin.Vault) {
        pre {
            Wonderland.totalSupply < Wonderland.MAX_SUPPLY : "Cannot mint new Wonderland: Max supply has been reached."
            cleoCoinVault.balance == Wonderland.coinRequirement[Wonderland.totalSupply] : "Cannot mint new Wonderland: Need exact amount of Cleo Coins required"
        }
        destroy cleoCoinVault

        self.worlds[self.totalSupply] <-! create World()
    }

    pub fun borrowWorld(id: UInt64): &Wonderland.World? {
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

        emit ContractInitialized()
    }

}