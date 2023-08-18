'use client';

import { useUser } from 'providers/UserProvider';
import React from 'react';

type Stats = {
	points: number;
	wins: number;
	losses: number;
};

const discordHandles = {
	'0x4742010dbfe107da': 'zz',
	'0x16af873a66616a17': 'bz_bb',
};

const Leaderboard = ({}: any) => {
	const { allRecords } = useUser();

	const calculateStats = (selectedSeason: string) => {
		let statsMap: { [address: string]: Stats } = {};

		// Filter by season
		const filteredRecords = allRecords.filter(
			(record: any) => record.season === selectedSeason
		);

		console.log('filteredRecords', filteredRecords);

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

	const RaidTable = ({ selectedSeason }: any) => {
		const stats = calculateStats(selectedSeason);
		console.log('stats', stats);

		const filteredRecords = allRecords.filter(
			(record: any) => record.season === selectedSeason
		);

		const totalRewardsWon = filteredRecords.filter(
			(record: any) => record.winner !== null
		).length;

		const allParticipants = [
			...filteredRecords.map((record: any) => record.attackerAddress),
			...filteredRecords.map((record: any) => record.defenderAddress),
		];
		const uniqueParticipants = new Set(allParticipants);
		const numberOfUniqueParticipants = uniqueParticipants.size;

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
									{discordHandles[
										stat.address as keyof typeof discordHandles
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
	};

	return (
		<div className="w-full max-w-5xl bg-custom-orange bg-opacity-10 p-8 rounded-lg mx-2 text-white border border-custom-orange mt-10">
			<div className="flex uppercase font-bold text-3xl justify-center mb-4">
				Leaderboard
			</div>
			<div className="w-full flex flex-col p-4">
				<RaidTable selectedSeason={'0'} />
			</div>
		</div>
	);
};

export default Leaderboard;
