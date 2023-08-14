'use client';

import React, { useState, useEffect } from 'react';
import Beasts from '@/components/dashboardTabs/contents/Beasts';
import Rewards from '@/components/dashboardTabs/contents/Rewards';
import '../../flow-config.js';
import { query } from '@onflow/fcl';
import { FETCH_BEASTS } from '@/flow/scripts/fetch_beasts';
import { FETCH_STAKED_BEASTS } from '@/flow/scripts/fetch_staked_beasts';
import { GET_ALL_STAKING_START_DATES } from '@/flow/scripts/get_all_staking_start_dates';
import { GET_ALL_ADJUSTED_STAKING_DATES } from '@/flow/scripts/get_all_adjusted_staking_dates.js';
import { GET_ALL_REWARDS } from '@/flow/scripts/get_all_rewards.js';
import { GET_REWARD_PER_SECOND } from '@/flow/scripts/get_reward_per_second.js';
import { useAuth } from 'providers/AuthProvider';
import RewardTableModal from '@/components/ui/RewardTableModal';

const Tab = ({ children }: any) => <div>{children}</div>;

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState('Beasts');
	const [stakedBeasts, setStakedBeasts] = useState([]);
	const [unstakedBeasts, setUnstakedBeasts] = useState([]);
	const [beasts, setBeasts] = useState([]);
	const [stakingStartDates, setStakingStartDates] = useState({});
	const [adjustedStakingDates, setAdjustedStakingDates] = useState({});
	const [rewards, setRewards] = useState<any>({});
	const [rewardPerSecond, setRewardPerSecond] = useState(604800.0);
	const { user, loggedIn, logIn } = useAuth();
	const [isModalOpen, setModalOpen] = useState(false);

	const tabItems = [
		{ name: 'Beasts' },
		{ name: 'Rewards' },
		// { name: 'Random' },
	];

	const TabItem = ({ item }: any) => (
		<button
			className={
				activeTab === item.name
					? 'border-b-2 border-white text-white'
					: 'text-gray-200 text-opacity-50'
			}
			onClick={() => setActiveTab(item.name)}
		>
			<div className="flex items-center pb-2">
				<div className="font-semibold text-lg whitespace-nowrap">
					{item.name}
				</div>
				<div
					className={
						activeTab === item.name
							? 'flex items-center justify-center border border-white bg-white ml-1.5 px-2 text-xs font-semibold text-black rounded-lg'
							: 'flex items-center justify-center border border-white border-opacity-50 ml-1.5 px-2 text-xs font-semibold text-gray-200 text-opacity-50 rounded-lg'
					}
				>
					{item.name === 'Beasts'
						? beasts.length
						: item.name === 'Rewards'
						? extractRewards(beasts, rewards).length
						: 0}
				</div>
			</div>
		</button>
	);

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
			// console.log(joinedCollection);
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
			// console.log(adjustedStakingDates);
		} catch (err) {
			console.log(err);
		}
	};

	const getRewards = async () => {
		try {
			let rewards = await query({
				cadence: GET_ALL_REWARDS,
			});
			// console.log('rewards: ', rewards);
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

	useEffect(() => {
		if (user?.addr != null) {
			fetchUserBeasts();
		} else {
			setBeasts([]);
		}
		getRewards();
		getRewardPerSecond();
		getTotalSupply();
	}, [user]);

	function extractRewards(beasts: any[], rewards: any) {
		return beasts.flatMap((beast: any) => {
			const beastRewards = rewards[beast.id];
			if (!beastRewards) {
				return [];
			}

			return Object.values(beastRewards).map((reward: any) => ({
				id: parseInt(reward.id, 10),
				nftID: beast.id,
				rewardItemTemplateID: parseInt(reward.rewardItemTemplateID, 10),
				revealed: reward.revealed,
				type: 'BasicBeasts',
			}));
		});
	}

	return (
		<>
			<div className="min-h-screen flex pt-20 pb-20 justify-center bg-center bg-no-repeat bg-cover bg-black">
				<div
					className="w-full max-w-5xl bg-custom-orange bg-opacity-10 p-5 rounded-lg mx-2 text-white border border-custom-orange"
					// style={{ filter: 'blur(25px)' }}
				>
					<div>
						{!loggedIn ? (
							<button
								onClick={() => logIn()}
								className="text-lg hover:underline"
							>
								Connect your wallet to see Dashboard
							</button>
						) : (
							<>
								<div className="flex border-b border-white border-opacity-20 gap-4">
									{/* TODO: Add reveal all, quest all, and info pop up */}
									{tabItems.map((item) => (
										<TabItem key={item.name} item={item} />
									))}
									{/* This div will grow and push the button to the right */}
									<div className="flex-grow"></div>

									{/* Question mark button */}
									<div className="p-1">
										<button
											onClick={() => setModalOpen(true)}
											className="px-2 border border-solid bg-transparent text-white rounded-full hover:bg-white hover:text-black transition-colors duration-150 focus:outline-none"
										>
											?
										</button>
									</div>
								</div>
								{activeTab === 'Beasts' && (
									<Beasts
										beasts={beasts}
										unstakedBeasts={unstakedBeasts}
										fetchUserBeasts={fetchUserBeasts}
										adjustedStakingDates={
											adjustedStakingDates
										}
										stakingStartDates={stakingStartDates}
										rewards={rewards}
										rewardPerSecond={rewardPerSecond}
									/>
								)}
								{activeTab === 'Rewards' && (
									<Rewards
										rewards={extractRewards(
											beasts,
											rewards
										)}
										getRewards={getRewards}
									/>
								)}
								{/* {activeTab === 'Random' && (
								<Tab>Random Content</Tab>
							)} */}
							</>
						)}
					</div>
				</div>
			</div>
			<RewardTableModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</>
	);
}
