import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import rewardTemplates from 'data/rewardTemplates';
import unknown from 'public/images/flovatar/vial-unrevealed.png';
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
import { toast } from 'react-toastify';
import { toastStatus } from '@/utils/toastStatus';
import ActionHeader from '../ActionHeader';
import FlovatarRevealedModal from '@/components/ui/Flovatar/FlovatarRevealedModal';
import { filterAndGroupRewards } from '@/utils/filterAndGroupRewards';
import { InView } from 'react-intersection-observer';
import { REVEAL_QUEST_REWARD } from '@/flow/transactions/flovatar/reveal_quest_reward';
import { REVEAL_MULTIPLE_QUEST_REWARDS } from '@/flow/transactions/flovatar/reveal_multiple_quest_rewards';
import { useWonder } from 'providers/WonderProvider';

const FlovatarQuestRewards = ({ rewards, questID }: any) => {
	const [revealed, setRevealed] = useState(false);
	const [currentRevealed, setCurrentRevealed] = useState();
	const { getFlovatarRewards } = useWonder();

	const Reward = ({ item, count }: any) => (
		<InView>
			<div
				onClick={() => console.log(item.revealed)}
				className="p-0 mb-4 bg-white bg-opacity-10 border border-solid border-white border-opacity-20 rounded overflow-hidden"
			>
				<div className="flex-auto flex flex-col w-full group relative">
					<div className=" overflow-hidden flex items-center relative">
						{item.revealed && (
							<div className="flex w-full absolute z-10 top-2">
								<div className="z-10 flex justify-center items-center absolute top-0 right-2 bg-white bg-opacity-80 rounded text-black text-xs font-semibold px-1.5 py-0.5">
									&nbsp;x{count}
								</div>
							</div>
						)}

						<div>
							{item.revealed ? (
								<Image
									alt={
										(
											rewardTemplates.find(
												(template: any) =>
													template.rewardItemTemplateID ===
														item.rewardItemTemplateID &&
													template.type === 'Flovatar'
											) || {
												type: 'Flovatar',
												rewardItemTemplateID: 1,
												name: 'Unrevealed',
												description: '',
												image: '/images/flovatar/vial-unrevealed.png',
											}
										).name
									}
									src={
										(
											rewardTemplates.find(
												(template: any) =>
													template.rewardItemTemplateID ===
														item.rewardItemTemplateID &&
													template.type === 'Flovatar'
											) || {
												type: 'Flovatar',
												rewardItemTemplateID: 1,
												name: 'Unrevealed',
												description: '',
												image: '/images/flovatar/vial-unrevealed.png',
											}
										).image
									}
									width={400}
									height={400}
								/>
							) : (
								<Image
									alt={'Unrevealed'}
									src={unknown.src}
									width={400}
									height={400}
								/>
							)}
						</div>
						{!item.revealed && (
							<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
								<button
									onClick={() => reveal(item.nftID, item.id)}
									className="justify-center bg-white bg-opacity-70 min-w-max px-4 py-1 hover:bg-opacity-100 flex items-center rounded-full text-sm drop-shadow text-black transition ease-in-out duration-100 group-hover:opacity-100"
								>
									Reveal
								</button>
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-initial flex-col p-2">
					<div className="truncate mt-1">
						<div className="flex items-center justify-between gap-x-2 flex-wrap h-7 overflow-hidden">
							<span className="flex items-center gap-1 text-xs text-white-2 min-w-0 min-h-[28px]">
								Reward
							</span>
							<p className="text-xs px-2 rounded-lg leading-snug text-white bg-white bg-opacity-30 border border-transparent">
								{item.revealed
									? (
											rewardTemplates.find(
												(template: any) =>
													template.rewardItemTemplateID ===
														item.rewardItemTemplateID &&
													template.type === 'Flovatar'
											) || {
												type: 'Flovatar',
												rewardItemTemplateID: 1,
												name: 'Unrevealed',
												description: '',
												image: '/images/flovatar/vial-unrevealed.png',
											}
									  ).name
									: 'Unrevealed'}
							</p>
						</div>
					</div>
				</div>
			</div>
		</InView>
	);

	const reveal = async (nftID: number, questRewardID: number) => {
		const id = toast.loading('Initializing...');
		// console.log('nftID: ', nftID);
		// console.log('rewardItemID: ', questRewardID);
		// console.log(
		// 	rewards.filter((reward: any) => reward.id == questRewardID)
		// );

		try {
			const res = await send([
				transaction(REVEAL_QUEST_REWARD),
				args([
					arg(
						String(process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS),
						t.Address
					),
					arg(questID, t.UInt64),
					arg(String(nftID), t.UInt64),
					arg(String(questRewardID), t.UInt64),
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
			getFlovatarRewards();
			setCurrentRevealed(
				rewards.filter((reward: any) => reward.id == questRewardID)
			);
			setRevealed(true);
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

	const revealAll = async () => {
		const id = toast.loading('Initializing...');
		const maxQuantity = 500; //tested
		const unrevealedRewards = rewards.filter(
			(reward: any) => !reward.revealed
		);

		const toReveal = unrevealedRewards.slice(0, maxQuantity);

		const mappedRewards = toReveal.map((reward: any) => [
			String(reward.nftID),
			String(reward.id),
		]);

		console.log('toReveal: ', toReveal.length);

		try {
			const res = await send([
				transaction(REVEAL_MULTIPLE_QUEST_REWARDS),
				args([
					arg(
						String(process.env.NEXT_PUBLIC_QUEST_MANAGER_ADDRESS),
						t.Address
					),
					arg(questID, t.UInt64),
					arg(mappedRewards, t.Array(t.Array(t.UInt64))),
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
			await tx(res).onceExecuted();
			setCurrentRevealed(toReveal);
			setRevealed(true);
			getFlovatarRewards();
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
			getFlovatarRewards();
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
		<div>
			<ActionHeader buttonText="Reveal All" action={revealAll} />
			<div>
				<div className="hidden lg:flex flex mb-4 mt-3.5">
					<div className="w-full grid grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2">
						<div className="w-full p-2.5 flex-grow rounded-lg border border-white border-opacity-12">
							<div>Unrevealed</div>
							<div className="text-xl">
								{
									rewards.filter(
										(reward: any) => !reward.revealed
									).length
								}
							</div>
						</div>
						<div className="w-full p-2.5 flex-grow rounded-lg bg-white bg-opacity-10">
							<div>Traveler</div>
							<div className="text-xl">
								{
									rewards.filter(
										(reward: any) =>
											reward.rewardItemTemplateID === 5 &&
											reward.revealed
									).length
								}
							</div>
						</div>
						<div className="w-full p-2.5 flex-grow rounded-lg bg-white bg-opacity-10">
							<div>Super</div>
							<div className="text-xl">
								{
									rewards.filter(
										(reward: any) =>
											reward.rewardItemTemplateID === 6 &&
											reward.revealed
									).length
								}
							</div>
						</div>
						<div className="w-full p-2.5 flex-grow rounded-lg bg-white bg-opacity-10">
							<div>Unearthly</div>
							<div className="text-xl">
								{
									rewards.filter(
										(reward: any) =>
											reward.rewardItemTemplateID === 7 &&
											reward.revealed
									).length
								}
							</div>
						</div>
						<div className="w-full p-2.5 flex-grow rounded-lg bg-white bg-opacity-10">
							<div>Divine</div>
							<div className="text-xl">
								{
									rewards.filter(
										(reward: any) =>
											reward.rewardItemTemplateID === 8 &&
											reward.revealed
									).length
								}
							</div>
						</div>
					</div>
				</div>
				<div className="mt-4 lg:mt-0 h-[540px] overflow-y-auto">
					<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
						{filterAndGroupRewards(
							rewards.filter((item: any) => item.revealed)
						).map((item: any) => (
							<Reward
								key={item.id}
								item={item}
								count={item.count}
							/>
						))}
						{rewards
							.filter((item: any) => !item.revealed)
							.map((item: any) => (
								<Reward key={item.id} item={item} />
							))}
					</div>
				</div>
			</div>

			<FlovatarRevealedModal
				isOpen={revealed}
				onClose={() => setRevealed(false)}
				revealedRewards={currentRevealed}
			/>
		</div>
	);
};

export default FlovatarQuestRewards;
