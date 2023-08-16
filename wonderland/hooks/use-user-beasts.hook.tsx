import { useEffect, useState } from 'react';
import { FETCH_BEASTS } from '@/flow/scripts/fetch_beasts';
import { FETCH_STAKED_BEASTS } from '@/flow/scripts/fetch_staked_beasts';
import { query } from '@onflow/fcl';
import { GET_ALL_STAKING_START_DATES } from '@/flow/scripts/get_all_staking_start_dates';
import { GET_ALL_ADJUSTED_STAKING_DATES } from '@/flow/scripts/get_all_adjusted_staking_dates.js';

export default function useUserBeasts(user: any) {
	const [beasts, setBeasts] = useState([]);
	const [stakedBeasts, setStakedBeasts] = useState([]);
	const [unstakedBeasts, setUnstakedBeasts] = useState([]);
	const [stakingStartDates, setStakingStartDates] = useState({});
	const [adjustedStakingDates, setAdjustedStakingDates] = useState({});

	useEffect(() => {
		if (user?.addr != null) {
			fetchUserBeasts();
		} else {
			setBeasts([]);
		}
	}, [user?.addr]);

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
			getStakingDates();
		} catch (err) {
			console.log(err);
		}
	};

	const getStakingDates = async () => {
		try {
			let adjustedStakingDates = await query({
				cadence: GET_ALL_ADJUSTED_STAKING_DATES,
			});
			let stakingStartDates = await query({
				cadence: GET_ALL_STAKING_START_DATES,
			});
			setAdjustedStakingDates(adjustedStakingDates);
			setStakingStartDates(stakingStartDates);
		} catch (err) {
			console.log(err);
		}
	};

	return {
		beasts,
		stakedBeasts,
		unstakedBeasts,
		fetchUserBeasts,
		stakingStartDates,
		adjustedStakingDates,
		getStakingDates,
	};
}
