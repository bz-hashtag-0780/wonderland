import { useEffect, useState } from 'react';
import { FETCH_BEASTS } from '@/flow/scripts/fetch_beasts';
import { FETCH_STAKED_BEASTS } from '@/flow/scripts/fetch_staked_beasts';
import { query } from '@onflow/fcl';
import { GET_QUESTING_START_DATES } from '@/flow/scripts/questing/get_questing_start_dates.js';
import { GET_ADJUSTED_QUESTING_DATES } from '@/flow/scripts/questing/get_adjusted_questing_dates.js';

export default function useUserBeasts(user: any) {
	const [beasts, setBeasts] = useState([]);
	const [questedBeasts, setQuestedBeasts] = useState([]);
	const [unquestedBeasts, setUnquestedBeasts] = useState([]);
	const [questingStartDates, setQuestingStartDates] = useState({});
	const [adjustedQuestingDates, setAdjustedQuestingDates] = useState({});

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
			setQuestedBeasts(stakingCollection);
			setUnquestedBeasts(beastCollection);
			getQuestingDates();
		} catch (err) {
			console.log(err);
		}
	};

	const getQuestingDates = async () => {
		try {
			let adjustedQuestingDates = await query({
				cadence: GET_ADJUSTED_QUESTING_DATES,
				args: (arg: any, t: any) => [
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(process.env.NEXT_PUBLIC_QUEST_ID_BEASTZ, t.UInt64),
				],
			});
			let questingStartDates = await query({
				cadence: GET_QUESTING_START_DATES,
			});
			setAdjustedQuestingDates(adjustedQuestingDates);
			setQuestingStartDates(questingStartDates);
		} catch (err) {
			console.log(err);
		}
	};

	return {
		beasts,
		questedBeasts,
		unquestedBeasts,
		fetchUserBeasts,
		questingStartDates,
		adjustedQuestingDates,
		getQuestingDates,
	};
}
