'use client';

import React, { useState, useEffect } from 'react';
import Beasts from '@/components/DashboardTabs/Beasts';
import Rewards from '@/components/DashboardTabs/Rewards';
import '../../flow-config.js';
import { query } from '@onflow/fcl';
import { FETCH_BEASTS } from '@/flow/scripts/fetch_beasts';
import { FETCH_STAKED_BEASTS } from '@/flow/scripts/fetch_staked_beasts';
import { GET_ALL_STAKING_START_DATES } from '@/flow/scripts/get_all_staking_start_dates';
import { GET_ALL_ADJUSTED_STAKING_DATES } from '@/flow/scripts/get_all_adjusted_staking_dates.js';
import { useAuth } from 'providers/AuthProvider';

const Tab = ({ children }: any) => <div>{children}</div>;

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState('Beasts');
	const [stakedBeasts, setStakedBeasts] = useState([]);
	const [unstakedBeasts, setUnstakedBeasts] = useState([]);
	const [beasts, setBeasts] = useState([]);
	const [stakingStartDates, setStakingStartDates] = useState(null);
	const [adjustedStakingDates, setAdjustedStakingDates] = useState(null);
	const { user } = useAuth();

	const tabItems = [
		{ name: 'Beasts' },
		{ name: 'Rewards' },
		{ name: 'Random' },
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
					{item.name === 'Beasts' ? beasts.length : 0}
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
			console.log(joinedCollection);
			setBeasts(joinedCollection);
			setStakedBeasts(stakingCollection);
			setUnstakedBeasts(beastCollection);
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
			console.log(adjustedStakingDates);
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
		getStakingDates();
	}, [user]);

	return (
		<div
			className="min-h-screen flex pt-20 pb-20 justify-center bg-center bg-no-repeat bg-cover"
			style={{ backgroundImage: `url(/background/landscape.png)` }}
		>
			<div className="w-full max-w-5xl bg-black bg-opacity-75 p-5 rounded-lg mx-2 text-white">
				<div className="flex border-b border-white border-opacity-20 gap-4">
					{tabItems.map((item) => (
						<TabItem key={item.name} item={item} />
					))}
				</div>
				{activeTab === 'Beasts' && (
					<Beasts
						beasts={beasts}
						unstakedBeasts={unstakedBeasts}
						fetchUserBeasts={fetchUserBeasts}
						adjustedStakingDates={adjustedStakingDates}
						stakingStartDates={stakingStartDates}
					/>
				)}
				{activeTab === 'Rewards' && <Rewards />}
				{activeTab === 'Random' && <Tab>Random Content</Tab>}
			</div>
		</div>
	);
}
