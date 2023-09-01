import FungibleToken from "./utility/FungibleToken.cdc"

pub contract CleoCoin: FungibleToken {

    pub event TokensInitialized(initialSupply: UFix64)
    pub event TokensWithdrawn(amount: UFix64, from: Address?)
    pub event TokensDeposited(amount: UFix64, to: Address?)
    pub event TokensMinted(amount: UFix64)

    pub let MAX_SUPPLY: UFix64
    pub let ALLOWED_AMOUNT_PER_MINTER: UFix64
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
        pub var allowedAmount: UFix64

        pub fun mintTokens(amount: UFix64): @CleoCoin.Vault {
            pre {
                amount > 0.0: "Amount minted must be greater than zero"
                amount <= self.allowedAmount: "Amount minted must be less than the allowed amount"
            }
            post {
                CleoCoin.totalSupply <= CleoCoin.MAX_SUPPLY: "Total supply must be less than or equal to the max supply"
            }
            self.allowedAmount = self.allowedAmount - amount
            CleoCoin.totalSupply = CleoCoin.totalSupply + amount
            emit TokensMinted(amount: amount)
            return <-create Vault(balance: amount)
        }

        init() {
            self.allowedAmount = CleoCoin.ALLOWED_AMOUNT_PER_MINTER
        }
    }

    access(account) fun createMinter(): @Minter {
        return <- create Minter()
    }

    init() {
        self.MAX_SUPPLY = 69_000_000_000.0
        self.ALLOWED_AMOUNT_PER_MINTER = 690_000_000.0
        self.totalSupply = 0.0


        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}