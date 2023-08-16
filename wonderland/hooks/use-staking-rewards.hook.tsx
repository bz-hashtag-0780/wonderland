import { useEffect, useState } from 'react';
import { GET_ALL_REWARDS } from '@/flow/scripts/get_all_rewards.js';
import { GET_REWARD_PER_SECOND } from '@/flow/scripts/get_reward_per_second.js';
import { query } from '@onflow/fcl';

export default function useRewards(user: any) {
	const [rewards, setRewards] = useState<any>({});
	const [rewardPerSecond, setRewardPerSecond] = useState(604800.0);

	useEffect(() => {
		if (user?.addr != null) {
			getRewards();
			getRewardPerSecond();
			getTotalSupply();
		}
	}, [user?.addr]);

	const getRewards = async () => {
		try {
			let rewards = await query({
				cadence: GET_ALL_REWARDS,
			});
			setRewards(rewards);
		} catch (err) {
			console.log(err);
		}
	};

	const getRewardPerSecond = async () => {
		try {
			let res = await query({
				cadence: GET_REWARD_PER_SECOND,
			});
			setRewardPerSecond(res);
		} catch (err) {
			console.log(err);
		}
	};

	const getTotalSupply = async () => {
		try {
			let totalSupply = await query({
				cadence: `
				import BasicBeastsNFTStakingRewards from 0xBasicBeastsNFTStakingRewards
				
				pub fun main(): UInt32 {
					return BasicBeastsNFTStakingRewards.totalSupply
				}
				`,
			});
			let burned = await query({
				cadence: `
				import BasicBeastsNFTStakingRewards from 0xBasicBeastsNFTStakingRewards
				
				pub fun main(): UInt32 {
					return BasicBeastsNFTStakingRewards.burned
				}
				`,
			});
			console.log('totalSupply', totalSupply);
			console.log('burned', burned);
		} catch (err) {
			console.log(err);
		}
	};

	return {
		rewards,
		rewardPerSecond,
		getRewards,
		getRewardPerSecond,
		getTotalSupply,
	};
}
