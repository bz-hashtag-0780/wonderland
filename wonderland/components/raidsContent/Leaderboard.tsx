'use client';

import { useUser } from 'providers/UserProvider';
import React, { useMemo } from 'react';

type Stats = {
	points: number;
	wins: number;
	losses: number;
};

const discordHandles = {
	'0x4742010dbfe107da': 'bz_bbclub',
	'0x16af873a66616a17': 'bb_tester',
	'0x71cc0591ab7cb0ad': 'kylepatrick',
	'0x29f293731fe0b0d6': 'swtvietgrl',
	'0x624d7ad010c7092e': 'Robert Miller#1536',
	'0x0ed7df0f7f4ca812': 'HowToTrainADragon#5084',
	'0xaf5608f8c25d9ec7': 'betahunter_#9096',
	'0xe1cfe1ba997b5aac': 'williblue',
	'0x3111a249b59e2e25': 'solleb',
	'0x98394e6f0712f5d7': 'nish_d',
	'0xce4f5ad4674d0995': '2amzabka',
};

// eslint-disable-next-line react/display-name
const RaidTable = React.memo(
	({
		selectedSeason,
		allRecords,
		idsToDiscordHandles,
		addressToDiscordIds,
	}: any) => {
		const stats = useMemo(
			() => calculateStats(selectedSeason, allRecords),
			[selectedSeason, allRecords]
		);

		const filteredRecords = useMemo(
			() =>
				allRecords.filter(
					(record: any) => record.season === selectedSeason
				),
			[allRecords, selectedSeason]
		);

		const totalRewardsWon = useMemo(
			() =>
				filteredRecords.filter((record: any) => record.winner !== null)
					.length,
			[filteredRecords]
		);

		const allParticipants = useMemo(
			() => [
				...filteredRecords.map((record: any) => record.attackerAddress),
				...filteredRecords.map((record: any) => record.defenderAddress),
			],
			[filteredRecords]
		);

		const numberOfUniqueParticipants = useMemo(() => {
			const uniqueParticipants = new Set(allParticipants);
			return uniqueParticipants.size;
		}, [allParticipants]);

		return (
			<div className="w-full">
				<div className="flex flex-end">
					<div className="flex gap-5 text-2xl mb-4">
						<div>
							<div className="flex font-bold text-white opacity-40 text-lg">
								Total Rewards Won
							</div>
							<div className="flex font-bold">
								{totalRewardsWon.toLocaleString()}
							</div>
						</div>
						<div>
							<div className="flex font-bold text-white opacity-40 text-lg">
								Total Participants
							</div>
							<div className="flex font-bold">
								{numberOfUniqueParticipants.toLocaleString()}
							</div>
						</div>
					</div>
				</div>
				<table className="w-full text-xl">
					<thead>
						<tr>
							<th>Rank</th>
							<th className="text-left">Discord Handle</th>
							<th>Total W - L</th>
							<th>Total Raid Points</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{stats.map((stat, index) => (
							<tr key={stat.address}>
								<td>{index + 1}</td>
								<td className="text-left">
									{idsToDiscordHandles[
										addressToDiscordIds[stat.address]
									] || stat.address}
								</td>
								<td>
									{stat.wins} - {stat.losses}
								</td>
								<td>{stat.points}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
);

const calculateStats = (selectedSeason: any, allRecords: any) => {
	let statsMap: { [address: string]: Stats } = {};

	// Filter by season
	const filteredRecords = allRecords.filter(
		(record: any) => record.season === selectedSeason
	);

	filteredRecords.forEach((record: any) => {
		// Initialize if doesn't exist
		if (!statsMap[record.attackerAddress]) {
			statsMap[record.attackerAddress] = {
				points: 0,
				wins: 0,
				losses: 0,
			};
		}

		if (!statsMap[record.defenderAddress]) {
			statsMap[record.defenderAddress] = {
				points: 0,
				wins: 0,
				losses: 0,
			};
		}

		// Calculate points
		statsMap[record.attackerAddress].points +=
			+record.attackerPointsAwarded;
		statsMap[record.defenderAddress].points +=
			+record.defenderPointsAwarded;

		// Calculate wins
		if (record.winner === record.attackerNFT) {
			statsMap[record.attackerAddress].wins += 1;
		} else if (record.winner === record.defenderNFT) {
			statsMap[record.defenderAddress].wins += 1;
		}

		// Calculate losses
		if (record.winner === record.defenderNFT) {
			statsMap[record.attackerAddress].losses += 1;
		} else if (record.winner === null) {
			statsMap[record.attackerAddress].losses += 1;
		} else {
			statsMap[record.defenderAddress].losses += 1;
		}
	});

	// Convert the map to an array and sort by points
	const sortedStats = Object.entries(statsMap)
		.map(([address, stats]) => ({ address, ...stats }))
		.sort((a, b) => b.points - a.points) // Highest points first
		.slice(0, 10); // Only top 10

	return sortedStats;
};

const Leaderboard = ({}: any) => {
	// const { allRecords, idsToDiscordHandles, addressToDiscordIds } = useUser();
	const allRecords = null;
	const idsToDiscordHandles = null;
	const addressToDiscordIds = null;
	return (
		<div className="w-full max-w-5xl bg-custom-orange bg-opacity-10 p-8 rounded-lg mx-2 text-white border border-custom-orange mt-10">
			<div className="flex uppercase font-bold text-3xl justify-center mb-4">
				Leaderboard
			</div>
			<div className="w-full flex flex-col p-4">
				<RaidTable
					selectedSeason={'0'}
					allRecords={allRecords}
					idsToDiscordHandles={idsToDiscordHandles}
					addressToDiscordIds={addressToDiscordIds}
				/>
			</div>
		</div>
	);
};

export default Leaderboard;
