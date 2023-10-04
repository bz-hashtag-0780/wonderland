import { useEffect, useState } from 'react';
import { FETCH_BEASTS } from '@/flow/scripts/fetch_beasts';
import { FETCH_STAKED_BEASTS } from '@/flow/scripts/fetch_staked_beasts';
import { query } from '@onflow/fcl';
import { GET_QUESTING_START_DATES } from '@/flow/scripts/questing/get_questing_start_dates.js';
import { GET_ADJUSTED_QUESTING_DATES } from '@/flow/scripts/questing/get_adjusted_questing_dates.js';
import questing from 'data/questing';

export default function useUserBeastz(user: any) {
	const [beastz, setBeastz] = useState([]);
	const [questedBeastz, setQuestedBeastz] = useState([]);
	const [unquestedBeastz, setUnquestedBeastz] = useState([]);
	const [questingStartDates, setQuestingStartDates] = useState({});
	const [adjustedQuestingDates, setAdjustedQuestingDates] = useState({});

	useEffect(() => {
		if (user?.addr != null) {
			fetchUserBeastz();
		} else {
			setBeastz([]);
		}
	}, [user?.addr]);

	const fetchUserBeastz = async () => {
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

			setBeastz(joinedCollection);
			setQuestedBeastz(stakingCollection);
			setUnquestedBeastz(beastCollection);
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
					arg(questing['beastz'], t.UInt64),
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
		beastz,
		questedBeastz,
		unquestedBeastz,
		fetchUserBeastz,
		questingStartDates,
		adjustedQuestingDates,
		getQuestingDates,
	};
}
