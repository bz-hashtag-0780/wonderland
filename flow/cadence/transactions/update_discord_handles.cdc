import DiscordHandles from "../contracts/DiscordHandles.cdc"

transaction(idsToDiscordHandles: {String: String}) {

    let adminRef: &DiscordHandles.Admin

    prepare(signer: AuthAccount) { 
        self.adminRef = signer.borrow<&DiscordHandles.Admin>(from: DiscordHandles.AdminStoragePath)
            ?? panic("No admin resource in storage")

    }

    execute {
        let IDs = idsToDiscordHandles.keys
        var i = 0
        while i < IDs.length {
            let discordID = IDs[i]
            self.adminRef.updateHandle(discordID: discordID, discordHandle: idsToDiscordHandles[discordID]!)
            i = i + 1
        }
    }
}