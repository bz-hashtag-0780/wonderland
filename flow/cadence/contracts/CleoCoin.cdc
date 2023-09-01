import FungibleToken from "./utility/FungibleToken.cdc"

pub contract CleoCoin {
    pub let MAX_SUPPLY: UFix64

    pub resource Vault {
        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }
    }

    pub resource Minter {
        init() {}
    }

    access(account) fun createMinter(): @Minter {
        return <- create Minter()
    }

    init() {
        self.MAX_SUPPLY = 69_000_000_000.0
    }
}