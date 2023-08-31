pub contract Wonderland {

    pub event ContractInitialized()

    pub var totalSupply: UInt64

    pub resource World {
        pub let id: UInt64

        init() {
            self.id = Wonderland.totalSupply

            Wonderland.totalSupply = Wonderland.totalSupply + 1
        }
    }

    init() {
        self.totalSupply = 0

        emit ContractInitialized()
    }

}