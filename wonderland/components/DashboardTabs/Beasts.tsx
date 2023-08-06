'use client';

import React from 'react';
import Image from 'next/image';
import {
	send,
	transaction,
	args,
	arg,
	payer,
	proposer,
	authorizations,
	limit,
	authz,
	decode,
	tx,
} from '@onflow/fcl';
import * as t from '@onflow/types';
import { STAKE } from '@/flow/transactions/stake';
import { UNSTAKE } from '@/flow/transactions/unstake';
import { toast } from 'react-toastify';
import { toastStatus } from '@/framework/toastStatus';

const Beasts = ({
	beasts,
	unstakedBeasts,
	fetchUserBeasts,
	adjustedStakingDates,
}: any) => {
	const dummyData = [
		{
			name: 'Beasts',
			image: 'https://basicbeasts.mypinata.cloud/ipfs/QmStptQqKw1aoa1U4MUF64KaxGYAx2WRoGkBuafHkLoJyD',
		},
		{
			name: 'Rewards',
			image: 'https://basicbeasts.mypinata.cloud/ipfs/QmStptQqKw1aoa1U4MUF64KaxGYAx2WRoGkBuafHkLoJyD',
		},
		{
			name: 'Random',
			image: 'https://basicbeasts.mypinata.cloud/ipfs/QmStptQqKw1aoa1U4MUF64KaxGYAx2WRoGkBuafHkLoJyD',
		},
	];

	const NFT = ({ item }: any) => (
		<div className="p-0 mb-4 bg-white bg-opacity-10 border border-solid border-white border-opacity-20 rounded-xl overflow-hidden">
			<div className="flex-auto flex flex-col w-full group relative">
				<div className="rounded-xl overflow-hidden flex items-center relative">
					{adjustedStakingDates[item.id] != null && (
						<div className="flex w-full absolute z-10 top-2">
							<div className="z-10 flex justify-center items-center absolute top-0 right-2 bg-white bg-opacity-80 rounded text-black text-xs font-semibold px-1.5 py-0.5">
								<span style={{ fontSize: '10px' }}>⏳</span>
								&nbsp;
								{calculateDaysElapsed(
									adjustedStakingDates[item.id]
								)}
								d
							</div>
						</div>
					)}

					<div>
						<Image
							alt={item.nickname}
							src={
								'https://basicbeasts.mypinata.cloud/ipfs/' +
								item.beastTemplate.image
							}
							width={400}
							height={400}
							priority={true}
						/>
					</div>
					<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						{unstakedBeasts.some(
							(unstakedBeast: any) => unstakedBeast.id === item.id
						) ? (
							<button
								onClick={() => quest(item.id)}
								className="justify-center bg-white bg-opacity-70 min-w-max px-4 py-1 hover:bg-opacity-100 flex items-center rounded-full text-sm drop-shadow text-black transition ease-in-out duration-100 group-hover:opacity-100"
							>
								Quest
							</button>
						) : (
							<button
								onClick={() => quitQuest(item.id)}
								className="justify-center bg-white bg-opacity-70 min-w-max px-4 py-1 hover:bg-opacity-100 flex items-center rounded-full text-sm drop-shadow text-black transition ease-in-out duration-100 group-hover:opacity-100"
							>
								Quit quest
							</button>
						)}
					</div>
				</div>
			</div>
			<div className="flex flex-initial flex-col p-2">
				<div className="truncate mt-1">
					<div className="flex items-center justify-between gap-x-2 flex-wrap h-7 overflow-hidden">
						<span className="flex items-center gap-1 font-bold text-white-2 min-w-0 min-h-[28px]">
							{item.nickname} #{item.serialNumber}
						</span>
						{adjustedStakingDates[item.id] != null && (
							<span className="flex items-center gap-1 text-white-2 text-sm min-w-0 min-h-[28px]">
								{calculateDaysElapsed(
									adjustedStakingDates[item.id]
								)}
								/7d
							</span>
						)}
					</div>
				</div>
				<div className="truncate mt-1">
					<div className="flex items-center justify-between gap-x-2 flex-wrap h-7 overflow-hidden">
						<span className="flex items-center gap-1 text-white-2 text-sm min-w-0 min-h-[28px]">
							Rewards:
						</span>
						<button className="text-sm text-pink-primary border border-solid shadow \ border-white hover:bg-white hover:border-white hover:text-black \ px-1.5 py-0.5 rounded transition-[background-color,border-color,color] ease-in-out duration-100 xs:block">
							Details
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	function calculateDaysElapsed(timestamp: number): number {
		const timestampInMilliseconds = timestamp * 1000;
		const dateFromTimestamp = new Date(timestampInMilliseconds);
		const currentDate = new Date();
		const diffInMilliseconds =
			currentDate.getTime() - dateFromTimestamp.getTime();
		const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
		return Math.floor(diffInDays);
	}

	const quest = async (nftID: number) => {
		const id = toast.loading('Initializing...');

		try {
			const res = await send([
				transaction(STAKE),
				args([arg(nftID, t.UInt64)]),
				payer(authz),
				proposer(authz),
				authorizations([authz]),
				limit(9999),
			]).then(decode);
			tx(res).subscribe((res: any) => {
				toastStatus(id, res.status);
				console.log(res);
			});
			await tx(res)
				.onceSealed()
				.then(() => {
					toast.update(id, {
						render: 'Transaction Sealed',
						type: 'success',
						isLoading: false,
						autoClose: 5000,
					});
				});
			fetchUserBeasts();
		} catch (err) {
			toast.update(id, {
				render: () => <div>Error, try again later...</div>,
				type: 'error',
				isLoading: false,
				autoClose: 5000,
			});
			console.log(err);
		}
	};

	const quitQuest = async (nftID: number) => {
		const id = toast.loading('Initializing...');

		try {
			const res = await send([
				transaction(UNSTAKE),
				args([arg(nftID, t.UInt64)]),
				payer(authz),
				proposer(authz),
				authorizations([authz]),
				limit(9999),
			]).then(decode);
			tx(res).subscribe((res: any) => {
				toastStatus(id, res.status);
				console.log(res);
			});
			await tx(res)
				.onceSealed()
				.then(() => {
					toast.update(id, {
						render: 'Transaction Sealed',
						type: 'success',
						isLoading: false,
						autoClose: 5000,
					});
				});
			fetchUserBeasts();
		} catch (err) {
			toast.update(id, {
				render: () => <div>Error, try again later...</div>,
				type: 'error',
				isLoading: false,
				autoClose: 5000,
			});
			console.log(err);
		}
	};

	return (
		<div className="pt-6">
			<div className="grid grid-cols-4 gap-x-4 gap-y-2 overflow-auto">
				{beasts != null && (
					<>
						{beasts.map((item: any) => (
							<NFT key={item.uuid} item={item} />
						))}
					</>
				)}
			</div>
		</div>
	);
};

export default Beasts;
