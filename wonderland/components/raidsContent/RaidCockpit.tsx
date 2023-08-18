'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSession, signIn } from 'next-auth/react';
import { useUser } from 'providers/UserProvider';
import { transform } from '@/utils/transform';
import { useAuth } from 'providers/AuthProvider';

const RaidCockpit = ({ setOpenRaidProfile, setOpenChooseBeast }: any) => {
	const { data: session }: any = useSession();
	const {
		raidBeast,
		beasts,
		rewards,
		exp,
		points,
		currentSeason,
		allRecords,
	} = useUser();
	const { user } = useAuth();

	const beast =
		raidBeast && beasts
			? transform(
					beasts.filter((beast: any) => raidBeast == beast.id),
					rewards
			  )[0]
			: null;

	const totalBeastSeasonWins =
		raidBeast && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						record.winner === raidBeast &&
						record.season === currentSeason
			  ).length
			: 0;

	const totalBeastSeasonLosses =
		raidBeast && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						(record.winner !== raidBeast &&
							record.season === currentSeason &&
							record.defenderNFT === raidBeast) ||
						(record.winner !== raidBeast &&
							record.season === currentSeason &&
							record.attackerNFT === raidBeast)
			  ).length
			: 0;

	const totalBeastSushiWins =
		raidBeast && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						record.winner === raidBeast &&
						record.season === currentSeason &&
						record.rewardTemplateID === '1'
			  ).length
			: 0;

	const totalBeastSushiLosses =
		raidBeast && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						record.attackerNFT === raidBeast &&
						record.winner !== record.attackerNFT &&
						record.season === currentSeason &&
						record.rewardTemplateID === '1'
			  ).length
			: 0;

	const totalBeastIceCreamWins =
		raidBeast && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						record.winner === raidBeast &&
						record.season === currentSeason &&
						record.rewardTemplateID === '2'
			  ).length
			: 0;

	const totalBeastIceCreamLosses =
		raidBeast && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						record.attackerNFT === raidBeast &&
						record.winner !== record.attackerNFT &&
						record.season === currentSeason &&
						record.rewardTemplateID === '2'
			  ).length
			: 0;

	const totalRaids =
		user?.addr && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						(record.attackerAddress === user?.addr &&
							record.season === currentSeason) ||
						(record.defenderAddress === user?.addr &&
							record.season === currentSeason)
			  ).length
			: 0;

	const totalRaided =
		user?.addr && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						record.attackerAddress === user?.addr &&
						record.season === currentSeason
			  ).length
			: 0;

	const totalSushiWins =
		user?.addr && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						(record.attackerAddress === user?.addr &&
							record.season === currentSeason &&
							record.rewardTemplateID === '1' &&
							record.winner === record.attackerNFT) ||
						(record.defenderAddress === user?.addr &&
							record.season === currentSeason &&
							record.rewardTemplateID === '1' &&
							record.winner === record.defenderNFT)
			  ).length
			: 0;

	const totalSushiLosses =
		user?.addr && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						(record.attackerAddress === user?.addr &&
							record.season === currentSeason &&
							record.rewardTemplateID === '1' &&
							record.winner !== record.attackerNFT) ||
						(record.defenderAddress === user?.addr &&
							record.season === currentSeason &&
							record.rewardTemplateID === '1' &&
							record.winner !== record.defenderNFT)
			  ).length
			: 0;

	const totalIceCreamWins =
		user?.addr && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						(record.attackerAddress === user?.addr &&
							record.season === currentSeason &&
							record.rewardTemplateID === '2' &&
							record.winner === record.attackerNFT) ||
						(record.defenderAddress === user?.addr &&
							record.season === currentSeason &&
							record.rewardTemplateID === '2' &&
							record.winner === record.defenderNFT)
			  ).length
			: 0;

	const totalIceCreamLosses =
		user?.addr && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						(record.attackerAddress === user?.addr &&
							record.season === currentSeason &&
							record.rewardTemplateID === '2' &&
							record.winner !== record.attackerNFT) ||
						(record.defenderAddress === user?.addr &&
							record.season === currentSeason &&
							record.rewardTemplateID === '2' &&
							record.winner !== record.defenderNFT)
			  ).length
			: 0;

	const totalWins =
		user?.addr && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						(record.attackerAddress === user?.addr &&
							record.season === currentSeason &&
							record.winner === record.attackerNFT) ||
						(record.defenderAddress === user?.addr &&
							record.season === currentSeason &&
							record.winner === record.defenderNFT)
			  ).length
			: 0;

	const totalLosses =
		user?.addr && allRecords && currentSeason
			? allRecords.filter(
					(record: any) =>
						(record.attackerAddress === user?.addr &&
							record.season === currentSeason &&
							record.winner !== record.attackerNFT) ||
						(record.defenderAddress === user?.addr &&
							record.season === currentSeason &&
							record.winner !== record.defenderNFT)
			  ).length
			: 0;

	const totalRaidPoints = getTotalPointsForAddress(
		allRecords,
		user?.addr,
		currentSeason
	);

	function getTotalPointsForAddress(
		allRecords: any[],
		walletAddress: string,
		currentSeason: any
	): number {
		return allRecords.reduce((total, record) => {
			if (record.season !== currentSeason) {
				return total;
			}

			if (record.attackerAddress === walletAddress) {
				return total + parseInt(record.attackerPointsAwarded, 10);
			} else if (record.defenderAddress === walletAddress) {
				return total + parseInt(record.defenderPointsAwarded, 10);
			}

			return total;
		}, 0);
	}

	const Info = ({ value, label, lastItem }: any) => (
		<div
			className={`flex flex-col relative h-auto bg-opacity-10 bg-white rounded-xl w-full p-4 mt-0 ${
				lastItem ? '' : 'mr-4'
			}`}
		>
			<div className="flex text-white opacity-40 text-sm">{label}</div>
			<div className="flex text-2xl font-bold">{value}</div>
		</div>
	);

	return (
		<div className="w-full max-w-5xl bg-custom-orange bg-opacity-10 p-8 rounded-lg mx-2 text-white border border-custom-orange">
			<div className="flex uppercase font-bold text-3xl justify-center mb-4">
				Raid Cockpit
			</div>
			{session && session.user ? (
				<div className="flex w-full flex-col">
					<div className="flex flex-col">
						<div className="flex">
							<div>
								<div className="relative overflow-hidden w-full bg-transparent rounded-xl">
									{beast && (
										<Image
											alt={'something'}
											src={
												'https://basicbeasts.mypinata.cloud/ipfs/' +
												beast?.image
											}
											width={400}
											height={400}
											priority={true}
										/>
									)}
								</div>
							</div>
							<div className="ml-4 w-full">
								<div className="flex w-full mb-4">
									<Info
										value={
											beast?.name + ' #' + beast?.serial
										}
										label={'Beast'}
									/>
									<Info
										value={
											beast?.sushiCount == 0 &&
											beast?.iceCreamCount == 0
												? 'Cannot Raid'
												: 'Ready to Raid'
										}
										label={'Status'}
										lastItem={true}
									/>
								</div>
								<div className="flex w-full mb-4">
									<Info
										value={exp[beast?.id] || 0}
										label={'EXP Points'}
									/>
									<Info
										value={beast?.sushiCount}
										label={'Sushi'}
									/>
									<Info
										value={beast?.iceCreamCount}
										label={'Ice Cream'}
										lastItem={true}
									/>
								</div>
								<div className="border-t border-white opacity-20 mb-1"></div>
								<div>
									<div className="mb-4 uppercase">
										beast season metrics
									</div>
									<div className="flex w-full mb-4">
										<Info
											value={
												totalBeastSeasonWins +
												' - ' +
												totalBeastSeasonLosses
											}
											label={'Win - Lose'}
										/>
										{points && points[currentSeason] && (
											<Info
												value={
													points[currentSeason][
														beast?.id
													] || 0
												}
												label={'Raid Points'}
												lastItem={true}
											/>
										)}
									</div>
									<div className="flex w-full">
										<Info
											value={
												totalBeastSushiWins +
												' - ' +
												totalBeastSushiLosses
											}
											label={'Sushi W - L'}
										/>
										<Info
											value={
												totalBeastIceCreamWins +
												' - ' +
												totalBeastIceCreamLosses
											}
											label={'Ice Cream W - L'}
											lastItem={true}
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="border-t border-white opacity-20 mt-4 mb-1"></div>
						<div>
							<div className="mb-4 uppercase">
								wallet season metrics
							</div>
							<div
								onClick={() => console.log(session.user)}
								className="flex w-full mb-4"
							>
								<Info
									value={
										session && session.user
											? session.user.name
											: ''
									}
									label={'Discord'}
								/>
								<Info
									value={totalWins + ' - ' + totalLosses}
									label={'Total W - L'}
								/>
								<Info value={totalRaids} label={'Raids'} />
								<Info
									value={totalRaided}
									label={'Raided'}
									lastItem={true}
								/>
							</div>
							<div className="flex w-full">
								<Info
									value={
										totalSushiWins +
										' - ' +
										totalSushiLosses
									}
									label={'Sushi W-L'}
								/>
								<Info
									value={
										totalIceCreamWins +
										' - ' +
										totalIceCreamLosses
									}
									label={'Ice Cream W-L'}
								/>
								<Info
									value={totalRaidPoints}
									label={'Total Raid Points'}
									lastItem={true}
								/>
							</div>
						</div>
					</div>
					<div className="border-t border-white opacity-20 mt-6 mb-1"></div>
					<div>
						<button
							onClick={() => setOpenRaidProfile(true)}
							className="flex justify-center items-center mt-6 border border-solid text-white hover:bg-white hover:text-black text-2xl py-1 px-4 w-full h-16 rounded-md font-bold transition duration-150 ease-in-out"
						>
							Edit Raid Profile
						</button>
					</div>
				</div>
			) : (
				<div>
					<button
						onClick={() => signIn('discord')}
						className="flex justify-center items-center mt-6 border border-solid text-white hover:bg-white hover:text-black text-2xl py-1 px-4 w-full h-16 rounded-md font-bold transition duration-150 ease-in-out"
					>
						Connect Discord
					</button>
				</div>
			)}
		</div>
	);
};

export default RaidCockpit;
