access(all) contract interface RewardAlgorithm {
    access(all) resource interface Algorithm {
        access(all) fun randomAlgorithm(): Int
    }
}