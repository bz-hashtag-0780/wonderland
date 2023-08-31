import CleoCoin from "./CleoCoin.cdc"

pub contract Wonderland {

    pub event ContractInitialized()

    pub var totalSupply: UInt64
    access(self) var worlds: @{UInt64: World}
    access(self) let coinRequirement: {UInt64:UFix64}

    pub resource World {
        pub let id: UInt64

        init() {
            self.id = Wonderland.totalSupply

            Wonderland.totalSupply = Wonderland.totalSupply + 1
        }
    }

    pub fun mintNewWonderland(cleoCoinVault: @CleoCoin.Vault) {
        pre {
            Wonderland.totalSupply < 10 : "Cannot mint new Wonderland: Max supply has been reached."
            cleoCoinVault.balance == Wonderland.coinRequirement[Wonderland.totalSupply] : "Cannot mint new Wonderland: Need exact amount of Cleo Coins required"
        }
        destroy cleoCoinVault

        self.worlds[self.totalSupply] <-! create World()
    }

    pub fun borrowWorld(id: UInt64): &Wonderland.World? {
        let ref = &self.worlds[id] as &Wonderland.World? //TODO: check if it's fine
        return ref
    }

    init() {
        self.totalSupply = 0
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