'use client';

import React, { useEffect, useState } from 'react';
import QuestResources from '../exploreTabs/contents/QuestResources';
import QuestRewards from '../exploreTabs/contents/QuestRewards';
import '../../flow-config.js';
import { useAuth } from '../../providers/AuthProvider';
import questing from '../../data/questing';
import { useWonder } from '../../providers/WonderProvider';
import RewardTableModal from './RewardTableModal';
import Flovatar from '../exploreTabs/contents/Flovatar';
import FlovatarQuestRewards from '../exploreTabs/contents/FlovatarQuestRewards';
import FlovatarRewardTableModal from './Flovatar/FlovatarRewardTableModal';

const FlovatarModal = ({ questingResources, isOpen, onClose }: any) => {
	const { flovatarRewards } = useWonder();
	const { loggedIn, logIn } = useAuth();
	const [activeTab, setActiveTab] = useState('Flovatar');
	const [isModalOpen, setModalOpen] = useState(false);

	const tabItems = [{ name: 'Flovatar' }, { name: 'Rewards' }];

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
					{item.name === 'Flovatar'
						? questingResources.length
						: item.name === 'Rewards'
						? extractRewards(questingResources, flovatarRewards)
								.length
						: 0}
				</div>
			</div>
		</button>
	);

	function extractRewards(questingResources: any[], rewards: any) {
		return questingResources.flatMap((questingResource: any) => {
			const questRewards = rewards[questingResource.uuid];
			if (!questRewards) {
				return [];
			}

			return Object.values(questRewards).map((reward: any) => ({
				id: parseInt(reward.id, 10),
				nftID: questingResource.id,
				rewardItemTemplateID: parseInt(reward.rewardTemplateID, 10),
				revealed: reward.revealed,
				type: 'Flovatar',
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
				<div className="bg-black bg-opacity-80 rounded-lg shadow-xl z-10">
					<div
						className="w-full max-w-5xl bg-custom-orange bg-opacity-10 p-5 rounded-lg text-white border border-custom-orange"
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
									{activeTab === 'Flovatar' && (
										<Flovatar
											questID={questing['flovatar']}
										/>
									)}
									{activeTab === 'Rewards' && (
										<FlovatarQuestRewards
											rewards={extractRewards(
												questingResources,
												flovatarRewards
											)}
											questID={questing['flovatar']}
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
				<FlovatarRewardTableModal
					isOpen={isModalOpen}
					onClose={() => setModalOpen(false)}
				/>
			</div>
		)
	);
};

export default FlovatarModal;
