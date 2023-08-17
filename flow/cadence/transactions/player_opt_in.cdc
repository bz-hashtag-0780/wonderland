import BasicBeastsRaids from "../contracts/BasicBeastsRaids.cdc"

transaction(nftID: UInt64, discordID: String) {

    let playerRef: &BasicBeastsRaids.Player

    prepare(signer: AuthAccount) {
        if signer.borrow<&BasicBeastsRaids.Player>(from: /storage/BasicBeastsRaidsPlayer_1) == nil {
            signer.save(<-BasicBeastsRaids.createNewPlayer(), to: /storage/BasicBeastsRaidsPlayer_1)
        }

        self.playerRef = signer.borrow<&BasicBeastsRaids.Player>(from: /storage/BasicBeastsRaidsPlayer_1)!
    }

    execute {
        self.playerRef.optIn(nftID: nftID, discordID: discordID)
    }
}