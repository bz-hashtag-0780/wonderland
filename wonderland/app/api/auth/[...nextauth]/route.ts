import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';

const handler = NextAuth({
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID as string,
			clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
			profile: (profile) => {
				return {
					...profile,
					id: profile.id,
					name: profile.username,
					email: profile.email,
					image: profile.image_url,
				};
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (user) {
				token.discordId = account?.providerAccountId || null;
			}
			return token;
		},
		async session({ session, token }: any) {
			session.user.discordId = token.discordId;
			return session;
		},
	},
});

export { handler as GET, handler as POST };
