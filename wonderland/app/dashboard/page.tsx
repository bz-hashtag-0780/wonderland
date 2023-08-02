'use client';

import React, { useState } from 'react';

const Tab = ({ children }: any) => <div>{children}</div>;

export default function Dashboard() {
	const [activeTab, setActiveTab] = useState('beasts');

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover"
			style={{ backgroundImage: `url(/background/landscape.png)` }}
		>
			<header className="p-5 text-center">
				<h1
					className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-wonderland text-white"
					style={{ textShadow: '2px 2px #000' }}
				>
					Dashboard
				</h1>

				<div className="bg-white bg-opacity-50 p-5 rounded-lg">
					<div className="flex border-b">
						<button
							className={
								activeTab === 'beasts'
									? 'border-b-2 border-blue-500'
									: ''
							}
							onClick={() => setActiveTab('beasts')}
						>
							Beasts
						</button>
						<button
							className={
								activeTab === 'rewards'
									? 'border-b-2 border-blue-500'
									: ''
							}
							onClick={() => setActiveTab('rewards')}
						>
							Rewards
						</button>
						<button
							className={
								activeTab === 'random'
									? 'border-b-2 border-blue-500'
									: ''
							}
							onClick={() => setActiveTab('random')}
						>
							Random
						</button>
					</div>
					{activeTab === 'beasts' && <Tab>Beasts Content</Tab>}
					{activeTab === 'rewards' && <Tab>Rewards Content</Tab>}
					{activeTab === 'random' && <Tab>Random Content</Tab>}
				</div>
			</header>
		</div>
	);
}
