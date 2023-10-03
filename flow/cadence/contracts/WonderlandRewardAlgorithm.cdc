import RewardAlgorithm from "./RewardAlgorithm.cdc";

access(all) contract WonderlandRewardAlgorithm: RewardAlgorithm {

    // -----------------------------------------------------------------------
    // Events
    // -----------------------------------------------------------------------
    access(all) event ContractInitialized()

    // -----------------------------------------------------------------------
    // Paths
    // -----------------------------------------------------------------------
    access(all) let AlgorithmStoragePath: StoragePath
    access(all) let AlgorithmPublicPath: PublicPath
    access(all) resource Algorithm: RewardAlgorithm.Algorithm {
        access(all) fun randomAlgorithm(): Int {
            // Generate a random number between 0 and 100_000_000
            let randomNum = Int(unsafeRandom() % 100_000_000)
            
            let threshold1 = 69_000_000 // for 69%
            let threshold2 = 87_000_000 // for 18%, cumulative 87%
            let threshold3 = 95_000_000 // for 8%, cumulative 95%
            let threshold4 = 99_000_000 // for 4%, cumulative 99%
            
            // Return reward based on generated random number
            if randomNum < threshold1 { return 1 }
            else if randomNum < threshold2 { return 2 }
            else if randomNum < threshold3 { return 3 }
            else if randomNum < threshold4 { return 4 }
            else { return 5 } // for remaining 1%
        }
    }

    access(all) fun createAlgorithm(): @Algorithm {
        return <- create WonderlandRewardAlgorithm.Algorithm()
    }

    access(all) fun borrowAlgorithm(): &Algorithm{RewardAlgorithm.Algorithm} {
        let cap: Capability<&WonderlandRewardAlgorithm.Algorithm{RewardAlgorithm.Algorithm}> = self.account.capabilities.get<&WonderlandRewardAlgorithm.Algorithm{RewardAlgorithm.Algorithm}>(self.AlgorithmPublicPath)!
        return cap.borrow()!
    }

    init() {
        self.AlgorithmStoragePath = /storage/WonderlandRewardAlgorithm_1
        self.AlgorithmPublicPath = /public/WonderlandRewardAlgorithm_1

        self.account.save(<-self.createAlgorithm(), to: self.AlgorithmStoragePath)

        self.account.capabilities.unpublish(self.AlgorithmPublicPath)

        let issuedCap = self.account.capabilities.storage.issue<&WonderlandRewardAlgorithm.Algorithm{RewardAlgorithm.Algorithm}>(self.AlgorithmStoragePath)

        self.account.capabilities.publish(issuedCap, at: self.AlgorithmPublicPath)

        emit ContractInitialized()
    }
}