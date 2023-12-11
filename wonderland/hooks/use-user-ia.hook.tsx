import { useEffect, useState } from 'react';
import { FETCH_IA } from '@/flow/scripts/ia/fetch_ia';
import { query } from '@onflow/fcl';
import questing from 'data/questing';
import { GET_QUESTING_START_DATES } from '@/flow/scripts/questing/get_questing_start_dates.js';
import { GET_ADJUSTED_QUESTING_DATES } from '@/flow/scripts/questing/get_adjusted_questing_dates.js';
import { GET_REWARDS } from '@/flow/scripts/questing/get_rewards.js';
import { GET_REWARD_PER_SECOND } from '@/flow/scripts/questing/get_reward_per_second.js';

export default function useUserIA(user: any) {
	const [ia, setIA] = useState([]);
	const [iaQuestingStartDates, setIAQuestingStartDates] = useState({});
	const [iaAdjustedQuestingDates, setIAAdjustedQuestingDates] = useState({});
	const [iaRewards, setIARewards] = useState<any>({});
	const [iaRewardPerSecond, setIARewardPerSecond] = useState(604800.0);

	useEffect(() => {
		if (user?.addr != null) {
			fetchUserIA();
			getIAQuestingDates();
			getIARewards();
			getRewardPerSecond();
		} else {
			setIA([]);
		}
	}, [user?.addr]);

	const fetchUserIA = async () => {
		try {
			let collection = await query({
				cadence: FETCH_IA,
				args: (arg: any, t: any) => [arg(user?.addr, t.Address)],
			});
			setIA(collection);
		} catch (err) {
			console.log(err);
		}
	};

	const getIAQuestingDates = async () => {
		try {
			let adjustedQuestingDates = await query({
				cadence: GET_ADJUSTED_QUESTING_DATES,
				args: (arg: any, t: any) => [
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(questing['ia'], t.UInt64),
				],
			});
			let questingStartDates = await query({
				cadence: GET_QUESTING_START_DATES,
				args: (arg: any, t: any) => [
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(questing['ia'], t.UInt64),
				],
			});
			setIAAdjustedQuestingDates(adjustedQuestingDates);
			setIAQuestingStartDates(questingStartDates);
		} catch (err) {
			console.log(err);
		}
	};

	const getIARewards = async () => {
		try {
			let rewards = await query({
				cadence: GET_REWARDS,
				args: (arg: any, t: any) => [
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(questing['ia'], t.UInt64),
				],
			});
			var restructuredRewards: any = {};
			for (let key in rewards) {
				restructuredRewards[key] = rewards[key].ownedNFTs;
			}
			setIARewards(restructuredRewards);
		} catch (err) {
			console.log(err);
		}
	};

	const getRewardPerSecond = async () => {
		try {
			let res = await query({
				cadence: GET_REWARD_PER_SECOND,
				args: (arg: any, t: any) => [
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(questing['ia'], t.UInt64),
				],
			});
			setIARewardPerSecond(res);
		} catch (err) {
			console.log(err);
		}
	};

	return {
		ia,
		fetchUserIA,
		iaQuestingStartDates,
		iaAdjustedQuestingDates,
		getIAQuestingDates,
		iaRewards,
		iaRewardPerSecond,
		getIARewards,
	};
}
