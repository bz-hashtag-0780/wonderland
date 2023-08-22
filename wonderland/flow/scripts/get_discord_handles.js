export const GET_DISCORD_HANDLES = `
import DiscordHandles from 0xDiscordHandles

pub fun main(): {String: String} {
    return DiscordHandles.getIdsToDiscordHandles()
}
`;
