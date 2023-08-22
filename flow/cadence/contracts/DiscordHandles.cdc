pub contract DiscordHandles {

    pub event ContractInitialized()
    pub event UpdatedHandle(discordID: String, discordHandle: String)

    pub let AdminStoragePath: StoragePath
    pub let AdminPrivatePath: PrivatePath

    access(self) var idsToDiscordHandles: {String: String}
    access(self) var discordHandlesToIds: {String: String}

    pub resource Admin {

        pub fun updateHandle(discordID: String, discordHandle: String) {
            DiscordHandles.idsToDiscordHandles[discordID] = discordHandle
            DiscordHandles.discordHandlesToIds[discordHandle] = discordID

            emit UpdatedHandle(discordID: discordID, discordHandle: discordHandle)
        }

        pub fun createNewAdmin(): @Admin {
            return <-create Admin()
        }
    }

    pub fun getIdsToDiscordHandles(): {String: String} {
        return self.idsToDiscordHandles
    }

    pub fun getIdToDiscordHandle(discordID: String): String? {
        return self.idsToDiscordHandles[discordID]
    }

    pub fun getDiscordHandlestoIds(): {String: String} {
        return self.discordHandlesToIds
    }

    pub fun getDiscordHandletoId(discordHandle: String): String? {
        return self.discordHandlesToIds[discordHandle]
    }

    init() {
        self.idsToDiscordHandles = {}
        self.discordHandlesToIds = {}

        self.AdminStoragePath = /storage/DiscordHandlesAdmin_1
        self.AdminPrivatePath = /private/DiscordHandlesAdminUpgrade_1

        self.account.save(<-create Admin(), to: self.AdminStoragePath)

        emit ContractInitialized()
    }

}