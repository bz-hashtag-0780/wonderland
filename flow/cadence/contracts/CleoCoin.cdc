import FungibleToken from "./utility/FungibleToken.cdc"

pub contract CleoCoin: FungibleToken {

    pub event TokensInitialized(initialSupply: UFix64)
    pub event TokensWithdrawn(amount: UFix64, from: Address?)
    pub event TokensDeposited(amount: UFix64, to: Address?)

    pub let MAX_SUPPLY: UFix64
    pub var totalSupply: UFix64

    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {
        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }

        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @CleoCoin.Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault
        }

        destroy() {
            CleoCoin.totalSupply = CleoCoin.totalSupply - self.balance
        }

    }

    pub fun createEmptyVault(): @CleoCoin.Vault {
        return <-create Vault(balance: 0.0)
    }

    pub resource Minter {
        init() {}
    }

    access(account) fun createMinter(): @Minter {
        return <- create Minter()
    }

    init() {
        self.MAX_SUPPLY = 69_000_000_000.0
        self.totalSupply = 0.0


        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}