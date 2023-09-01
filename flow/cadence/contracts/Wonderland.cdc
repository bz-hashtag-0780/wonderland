import CleoCoin from "./CleoCoin.cdc"

pub contract Wonderland {

    pub event ContractInitialized()

    pub let PLOT_LIMIT_PER_WORLD: Int

    pub var totalSupply: UInt64
    pub var totalPlotSupply: UInt32
    access(self) var worlds: @{UInt64: World}
    access(self) let coinRequirement: {UInt64:UFix64}

    pub resource Plot {
        pub let id: UInt32
        pub let coins: @CleoCoin.Minter?
        access(self) var data: @{UInt64:AnyResource} // future farmable resources

        init() {
            self.id = Wonderland.totalPlotSupply
            self.coins <- nil
            self.data <- {}

            Wonderland.totalPlotSupply = Wonderland.totalPlotSupply + 1
        }

        destroy() {
            destroy self.coins
            destroy self.data
        }
    }

    pub resource World {
        pub let id: UInt64
        access(self) var plots: @{UInt32:Plot}

        init() {
            self.id = Wonderland.totalSupply

            self.plots <- {}

            var i = 0
            while i < Wonderland.PLOT_LIMIT_PER_WORLD {
                self.plots[Wonderland.totalPlotSupply] <-! create Plot()
                i = i + 1
            }

            Wonderland.totalSupply = Wonderland.totalSupply + 1
        }

        pub fun borrowPlot(id: UInt32): &Wonderland.Plot? {
            return &self.plots[id] as &Wonderland.Plot?
        }

        destroy() {
            destroy self.plots
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
        return &self.worlds[id] as &Wonderland.World?
    }

    access(account) fun nameWorld(name: String, plotID: UInt32) {

    }

    init() {
        self.PLOT_LIMIT_PER_WORLD = 10
        self.totalSupply = 0
        self.totalPlotSupply = 0
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