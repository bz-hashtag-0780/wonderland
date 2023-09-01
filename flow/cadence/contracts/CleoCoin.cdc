pub contract CleoCoin {
    pub resource Vault {
        pub var balance: UFix64

        init(balance: UFix64) {
            self.balance = balance
        }
    }

    pub resource Minter {
        
    }

    access(account) 
}