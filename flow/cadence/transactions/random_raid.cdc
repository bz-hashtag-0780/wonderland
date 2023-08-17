import BasicBeastsRaids from "../contracts/BasicBeastsRaids.cdc"

transaction(attacker: Address) {

    let gameMasterRef: &BasicBeastsRaids.GameMaster

    prepare(signer: AuthAccount) {
        self.gameMasterRef = signer.borrow<&BasicBeastsRaids.GameMaster>(from: BasicBeastsRaids.GameMasterStoragePath)!
    }

    execute {
        self.gameMasterRef.randomRaid(attacker: attacker)
    }
}