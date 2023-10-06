'use client';

import React, { useEffect, useState } from 'react';
import QuestResources from '@/components/exploreTabs/contents/QuestResources';
import QuestRewards from '@/components/exploreTabs/contents/QuestRewards';
import '../../flow-config.js';
import { useAuth } from 'providers/AuthProvider';
import { useUser } from 'providers/UserProvider';
import questing from 'data/questing';
import { useWonder } from 'providers/WonderProvider';

const QuestingModal = ({ questingResources, isOpen, onClose }: any) => {
	const { rewards } = useWonder();
	const { loggedIn, logIn } = useAuth();
	const [activeTab, setActiveTab] = useState('Beastz');
	const [isModalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		console.log('rewards', rewards);
	}, [rewards]);

	const tabItems = [{ name: 'Beastz' }, { name: 'Rewards' }];

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
					{item.name === 'Beastz'
						? questingResources.length
						: item.name === 'Rewards'
						? extractRewards(questingResources, rewards).length
						: 0}
				</div>
			</div>
		</button>
	);

	function extractRewards(questingResources: any[], rewards: any) {
		return questingResources.flatMap((beast: any) => {
			const beastRewards = rewards[beast.id];
			if (!beastRewards) {
				return [];
			}

			return Object.values(beastRewards).map((reward: any) => ({
				id: parseInt(reward.id, 10),
				nftID: beast.id,
				rewardTemplateID: parseInt(reward.rewardTemplateID, 10),
				revealed: reward.revealed,
				type: 'BasicBeasts',
			}));
		});
	}
	return (
		isOpen && (
			<div className="fixed inset-0 flex justify-center items-center z-50">
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black opacity-50"
					onClick={onClose}
				></div>
				<div className="bg-black p-6 rounded-lg shadow-xl overflow-scroll z-10">
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
											<TabItem
												key={item.name}
												item={item}
											/>
										))}
										{/* This div will grow and push the button to the right */}
										<div className="flex-grow"></div>
										{/* Question mark button */}
										<div className="p-1">
											<button
												onClick={() =>
													setModalOpen(true)
												}
												className="px-2 border border-solid bg-transparent text-white rounded-full hover:bg-white hover:text-black transition-colors duration-150 focus:outline-none"
											>
												?
											</button>
										</div>
									</div>
									{activeTab === 'Beastz' && (
										<QuestResources
											questID={questing['beastz']}
										/>
									)}
									{activeTab === 'Rewards' && (
										<QuestRewards
											rewards={extractRewards(
												questingResources,
												rewards
											)}
											questID={questing['beastz']}
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
			</div>
		)
	);
};

export default QuestingModal;
