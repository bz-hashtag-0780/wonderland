import { config } from '@onflow/fcl';

config({
	'app.detail.title': process.env.NEXT_PUBLIC_APP_TITLE,
	// 'app.detail.icon': process.env.NEXT_PUBLIC_APP_ICON,
	'accessNode.api': process.env.NEXT_PUBLIC_ACCESS_NODE_API,
	'flow.network': process.env.NEXT_PUBLIC_FLOW_NETWORK,
	'discovery.wallet': process.env.NEXT_PUBLIC_DISCOVERY_WALLET,
	'0xBasicBeasts': process.env.NEXT_PUBLIC_BASIC_BEASTS_ADDRESS,
	'0xBasicBeastsNFTStaking': process.env.NEXT_PUBLIC_MVP_ADDRESS,
	'0xBasicBeastsNFTStakingRewards': process.env.NEXT_PUBLIC_MVP_ADDRESS,
	'0xBasicBeastsRaids': process.env.NEXT_PUBLIC_MVP_ADDRESS,
	'0xDiscordHandles': process.env.NEXT_PUBLIC_MVP_ADDRESS,
	'0xQuesting': process.env.NEXT_PUBLIC_LIVE_PRODUCT_ADDRESS,
	'0xQuestReward': process.env.NEXT_PUBLIC_LIVE_PRODUCT_ADDRESS,
	'0xRewardAlgorithm': process.env.NEXT_PUBLIC_LIVE_PRODUCT_ADDRESS,
	'0xWonderlandRewardAlgorithm': process.env.NEXT_PUBLIC_LIVE_PRODUCT_ADDRESS,
	'0xNonFungibleToken': process.env.NEXT_PUBLIC_NON_FUNGIBLE_TOKEN_ADDRESS,
	'0xMetadataViews': process.env.NEXT_PUBLIC_METADATA_VIEWS_ADDRESS,
});
