'use client';

import React, { useState } from 'react';
import Beasts from '@/components/DashboardTabs/Beasts';

const Tab = ({ children }: any) => <div>{children}</div>;

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState('Beasts');

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
			<div className="flex items-center mr-4">
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
					1
				</div>
			</div>
		</button>
	);

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover"
			style={{ backgroundImage: `url(/background/landscape.png)` }}
		>
			<div className="w-full max-w-4xl bg-black bg-opacity-50 p-5 rounded-lg mx-2 text-white">
				<div className="flex border-b">
					{tabItems.map((item) => (
						<TabItem key={item.name} item={item} />
					))}
				</div>
				{activeTab === 'Beasts' && <Beasts />}
				{activeTab === 'Rewards' && <Tab>Rewards Content</Tab>}
				{activeTab === 'Random' && <Tab>Random Content</Tab>}
			</div>
		</div>
	);
}
