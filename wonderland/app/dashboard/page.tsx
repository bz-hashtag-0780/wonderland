'use client';

import React, { useState } from 'react';
import Beasts from '@/components/dashboardTabs/contents/Beasts';
import Rewards from '@/components/dashboardTabs/contents/Rewards';
import '../../flow-config.js';
import { useAuth } from 'providers/AuthProvider';
import RewardTableModal from '@/components/ui/RewardTableModal';
import { useUser } from 'providers/UserProvider';

export default function Dashboard() {
	const { beasts, rewards } = useUser();
	const { loggedIn, logIn } = useAuth();
	const [activeTab, setActiveTab] = useState('Beasts');
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
								{activeTab === 'Beasts' && <Beasts />}
								{activeTab === 'Rewards' && (
									<Rewards
										rewards={extractRewards(
											beasts,
											rewards
										)}
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
