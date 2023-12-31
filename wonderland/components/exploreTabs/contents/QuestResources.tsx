'use client';

import React, { useState, useEffect } from 'react';
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
import { QUEST } from '@/flow/transactions/questing/quest';
import { UNQUEST } from '@/flow/transactions/questing/unquest';
import { QUEST_MULTIPLE } from '@/flow/transactions/questing/quest_multiple';
import { toast } from 'react-toastify';
import { toastStatus } from '@/utils/toastStatus';
import ActionHeader from '../ActionHeader';
import { InView } from 'react-intersection-observer';
import { useWonder } from 'providers/WonderProvider';
import QuestingResourceDetailsModal from '@/components/ui/QuestingResourceDetailsModal';

const QuestResources = ({ questID }: any) => {
	const [currentBeast, setCurrentBeast] = useState(null);
	const [openDetailsModal, setOpenDetailsModal] = useState(false);

	const {
		beastz,
		questingStartDates,
		adjustedQuestingDates,
		getQuestingDates,
		rewards,
		rewardPerSecond,
	} = useWonder();

	const NFT = ({ item }: any) => (
		<InView>
			<div
				onClick={() => console.log(item.uuid)}
				className="p-0 mb-4 bg-white bg-opacity-10 border border-solid border-white border-opacity-20 rounded-xl overflow-hidden"
			>
				<div className="flex-auto flex flex-col w-full group relative">
					<div className="rounded-xl overflow-hidden flex items-center relative">
						{questingStartDates[item.uuid] != null && (
							<div className="flex w-full absolute z-10 top-2">
								<div className="z-10 flex justify-center items-center absolute top-0 right-2 bg-white bg-opacity-80 rounded text-black text-xs font-semibold px-1.5 py-0.5">
									<span style={{ fontSize: '10px' }}>⏳</span>
									&nbsp;
									{calculateDaysElapsed(
										questingStartDates[item.uuid]
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
							{!Object.keys(questingStartDates).includes(
								item.uuid.toString()
							) ? (
								<button
									onClick={() => quest(item.uuid)}
									className="justify-center bg-white bg-opacity-70 min-w-max px-4 py-1 hover:bg-opacity-100 flex items-center rounded-full text-sm drop-shadow text-black transition ease-in-out duration-100 group-hover:opacity-100"
								>
									Quest
								</button>
							) : (
								<button
									onClick={() => quitQuest(item.uuid)}
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
							{adjustedQuestingDates[item.uuid] != null && (
								<span className="flex items-center gap-1 text-white-2 text-sm min-w-0 min-h-[28px]">
									{calculateDaysElapsed(
										adjustedQuestingDates[item.uuid]
									)}
									/
									{Math.floor(rewardPerSecond / 60 / 60 / 24)}
									d
								</span>
							)}
						</div>
					</div>

					{/*Only show if it has rewards*/}

					<div className="truncate mt-1">
						<div className="flex items-center justify-between gap-x-2 flex-wrap h-7 overflow-hidden">
							<span className="flex items-center gap-1 text-white-2 text-sm min-w-0 min-h-[28px]">
								Rewards:{' '}
								{rewards[item.uuid] != null
									? Object.keys(rewards[item.uuid]).length
									: 0}
							</span>
							{rewards[item.uuid] != null && (
								<button
									onClick={() => {
										setCurrentBeast(item);
										setOpenDetailsModal(true);
									}}
									className="text-sm text-pink-primary border border-solid shadow \ border-white hover:bg-white hover:border-white hover:text-black \ px-1.5 py-0.5 rounded transition-[background-color,border-color,color] ease-in-out duration-100 xs:block"
								>
									Details
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		</InView>
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

	const quest = async (nftID: String) => {
		const id = toast.loading('Initializing...');

		try {
			const res = await send([
				transaction(QUEST),
				args([
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(questID, t.UInt64),
					arg(nftID, t.UInt64),
				]),
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
			getQuestingDates();
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

	const questAll = async () => {
		const id = toast.loading('Initializing...');
		const maxQuantity = 150; //tested with 150

		const nonQuestingResources = beastz?.filter(
			(questingResource: any) =>
				!Object.keys(questingStartDates).includes(questingResource.uuid)
		);

		const toStake = nonQuestingResources
			.slice(0, maxQuantity)
			.map((item: any) => item.uuid);

		console.log('toStake', toStake);

		try {
			const res = await send([
				transaction(QUEST_MULTIPLE),
				args([
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(questID, t.UInt64),
					arg(toStake, t.Array(t.UInt64)),
					arg(String(maxQuantity), t.Int),
				]),
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
			getQuestingDates();
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

	const quitQuest = async (nftID: String) => {
		const id = toast.loading('Initializing...');

		try {
			const res = await send([
				transaction(UNQUEST),
				,
				args([
					arg(
						process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS,
						t.Address
					),
					arg(questID, t.UInt64),
					arg(nftID, t.UInt64),
				]),
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
			getQuestingDates();
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

	const sortedQuestingResources =
		beastz && questingStartDates
			? beastz?.sort((a: any, b: any) => {
					// If 'a' is in questingResourceIDs and 'b' isn't, return -1 (to sort 'a' before 'b')
					if (
						Object.keys(questingStartDates).includes(a.id) &&
						!Object.keys(questingStartDates).includes(b.id)
					) {
						return -1;
					}
					// If 'b' is in questingResourceIDs and 'a' isn't, return 1 (to sort 'b' before 'a')
					if (
						Object.keys(questingStartDates).includes(b.id) &&
						!Object.keys(questingStartDates).includes(a.id)
					) {
						return 1;
					}
					// If both 'a' and 'b' are in questingResourceIDs or neither are, keep their relative order unchanged
					return 0;
			  })
			: null;

	return (
		<>
			<ActionHeader buttonText="Quest All" action={questAll} />

			<div className="pt-6 h-[645px] overflow-y-auto">
				<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
					{sortedQuestingResources != null && (
						<>
							{sortedQuestingResources.map((item: any) => (
								<NFT key={item.uuid} item={item} />
							))}
						</>
					)}
				</div>
			</div>
			{openDetailsModal && (
				<QuestingResourceDetailsModal
					beast={currentBeast}
					onClose={() => {
						setOpenDetailsModal(false);
						setCurrentBeast(null);
					}}
					rewards={rewards}
				/>
			)}
		</>
	);
};

export default QuestResources;
