import { useEffect, useState } from 'react';
import { FETCH_FLOVATARS } from '@/flow/scripts/flovatar/fetch_flovatars';
import { query } from '@onflow/fcl';
import questing from 'data/questing';
import { GET_QUESTING_START_DATES } from '@/flow/scripts/questing/get_questing_start_dates.js';
import { GET_ADJUSTED_QUESTING_DATES } from '@/flow/scripts/questing/get_adjusted_questing_dates.js';
import { GET_REWARDS } from '@/flow/scripts/questing/get_rewards.js';
import { GET_REWARD_PER_SECOND } from '@/flow/scripts/questing/get_reward_per_second.js';

export default function useUserFlovatar(user: any) {
	const [flovatar, setFlovatar] = useState([]);
	const [flovatarQuestingStartDates, setFlovatarQuestingStartDates] =
		useState({});
	const [flovatarAdjustedQuestingDates, setFlovatarAdjustedQuestingDates] =
		useState({});
	const [flovatarRewards, setFlovatarRewards] = useState<any>({});
	const [flovatarRewardPerSecond, setFlovatarRewardPerSecond] =
		useState(604800.0);

	useEffect(() => {
		if (user?.addr != null) {
			fetchUserFlovatar();
			getFlovatarQuestingDates();
			getFlovatarRewards();
			getRewardPerSecond();
		} else {
			setFlovatar([]);
		}
	}, [user?.addr]);

	const fetchUserFlovatar = async () => {
		try {
			let collection = await query({
				cadence: FETCH_FLOVATARS,
				args: (arg: any, t: any) => [arg(user?.addr, t.Address)],
			});
			console.log('flovatar', collection);
			setFlovatar(collection);
		} catch (err) {
			console.log(err);
		}
	};

	const getFlovatarQuestingDates = async () => {
		try {
			let adjustedQuestingDates = await query({
				cadence: GET_ADJUSTED_QUESTING_DATES,
				args: (arg: any, t: any) => [
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(questing['flovatar'], t.UInt64),
				],
			});
			let questingStartDates = await query({
				cadence: GET_QUESTING_START_DATES,
				args: (arg: any, t: any) => [
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(questing['flovatar'], t.UInt64),
				],
			});
			setFlovatarAdjustedQuestingDates(adjustedQuestingDates);
			setFlovatarQuestingStartDates(questingStartDates);
		} catch (err) {
			console.log(err);
		}
	};

	const getFlovatarRewards = async () => {
		try {
			let rewards = await query({
				cadence: GET_REWARDS,
				args: (arg: any, t: any) => [
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(questing['flovatar'], t.UInt64),
				],
			});
			var restructuredRewards: any = {};
			for (let key in rewards) {
				restructuredRewards[key] = rewards[key].ownedNFTs;
			}
			setFlovatarRewards(restructuredRewards);
			console.log(restructuredRewards);
		} catch (err) {
			console.log(err);
		}
	};

	const getRewardPerSecond = async () => {
		console.log('quest id', questing['flovatar']);
		try {
			let res = await query({
				cadence: GET_REWARD_PER_SECOND,
				args: (arg: any, t: any) => [
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(questing['flovatar'], t.UInt64),
				],
			});
			setFlovatarRewardPerSecond(res);
		} catch (err) {
			console.log(err);
		}
	};

	return {
		flovatar,
		fetchUserFlovatar,
		flovatarQuestingStartDates,
		flovatarAdjustedQuestingDates,
		getFlovatarQuestingDates,
		flovatarRewards,
		flovatarRewardPerSecond,
		getFlovatarRewards,
	};
}
