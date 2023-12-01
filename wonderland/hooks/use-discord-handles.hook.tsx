import { useEffect, useState } from 'react';
import { query } from '@onflow/fcl';
import { GET_DISCORD_HANDLES } from '@/flow/scripts/get_discord_handles';
import { GET_DISCORD_IDS } from '@/flow/scripts/get_discord_ids';

export default function useDiscordHandles() {
	const [idsToDiscordHandles, setIdsToDiscordHandles] = useState<any>({});
	const [addressToDiscordIds, setAddressToDiscordIds] = useState<any>({});

	// useEffect(() => {
	// 	getIdsToDiscordHandles();
	// 	getAddressToIds();
	// }, []);

	const getIdsToDiscordHandles = async () => {
		try {
			let response = await query({
				cadence: GET_DISCORD_HANDLES,
			});
			setIdsToDiscordHandles(response);
		} catch (err) {
			console.log(err);
		}
	};

	const getAddressToIds = async () => {
		try {
			let response = await query({
				cadence: GET_DISCORD_IDS,
			});
			setAddressToDiscordIds(response);
			console.log(response);
		} catch (err) {
			console.log(err);
		}
	};

	return {
		idsToDiscordHandles,
		addressToDiscordIds,
	};
}
