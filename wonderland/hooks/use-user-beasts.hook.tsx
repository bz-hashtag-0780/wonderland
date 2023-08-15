import { useEffect, useState } from 'react';
import { FETCH_BEASTS } from '@/flow/scripts/fetch_beasts';
import { FETCH_STAKED_BEASTS } from '@/flow/scripts/fetch_staked_beasts';
import { query } from '@onflow/fcl';

export default function useUserBeasts(user: any) {
	const [beasts, setBeasts] = useState([]);
	const [stakedBeasts, setStakedBeasts] = useState([]);
	const [unstakedBeasts, setUnstakedBeasts] = useState([]);

	useEffect(() => {
		if (user?.addr != null) {
			fetchUserBeasts();
		} else {
			setBeasts([]);
		}
	}, [user]);

	const fetchUserBeasts = async () => {
		try {
			let beastCollection = await query({
				cadence: FETCH_BEASTS,
				args: (arg: any, t: any) => [arg(user?.addr, t.Address)],
			});
			let stakingCollection = await query({
				cadence: FETCH_STAKED_BEASTS,
				args: (arg: any, t: any) => [arg(user?.addr, t.Address)],
			});
			let joinedCollection = stakingCollection.concat(beastCollection);

			setBeasts(joinedCollection);
			setStakedBeasts(stakingCollection);
			setUnstakedBeasts(beastCollection);
			// getStakingDates();
		} catch (err) {
			console.log(err);
		}
	};

	return {
		beasts,
		stakedBeasts,
		unstakedBeasts,
		fetchUserBeasts,
	};
}
