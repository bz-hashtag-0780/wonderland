import React, { useState } from 'react';
import Image from 'next/image';
import rewardTemplates from 'data/rewardTemplates';
import unknown from 'public/images/basicBeasts/unknown.jpeg';
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
import { toastStatus } from '@/framework/toastStatus';
import { REVEAL } from '@/flow/transactions/reveal';

const Rewards = ({ rewards, getRewards }: any) => {
	const [rerender, setRerender] = useState(false);

	const Reward = ({ item }: any) => (
		<div className="p-0 mb-4 bg-white bg-opacity-10 border border-solid border-white border-opacity-20 rounded-xl overflow-hidden">
			<div className="flex-auto flex flex-col w-full group relative">
				<div className="rounded-xl overflow-hidden flex items-center relative">
					<div>
						{item.revealed ? (
							<Image
								alt={item.name}
								src={item.image}
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
					<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<button
							onClick={() => reveal(item.nftID, item.id)}
							className="justify-center bg-white bg-opacity-70 min-w-max px-4 py-1 hover:bg-opacity-100 flex items-center rounded-full text-sm drop-shadow text-black transition ease-in-out duration-100 group-hover:opacity-100"
						>
							Reveal
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-initial flex-col p-2">
				<div className="truncate mt-1">
					<div className="flex items-center justify-between gap-x-2 flex-wrap h-7 overflow-hidden">
						<span className="flex items-center gap-1 text-xs text-white-2 min-w-0 min-h-[28px]">
							Reward
						</span>
						<p className="text-xs px-2 rounded-lg leading-snug text-white bg-white bg-opacity-30 border border-transparent">
							{item.reveald ? item.name : 'Unrevealed'}
						</p>
					</div>
				</div>
			</div>
		</div>
	);

	const reveal = async (nftID: number, rewardItemID: number) => {
		const id = toast.loading('Initializing...');
		console.log('nftID: ', nftID);
		console.log('rewardItemID: ', rewardItemID);

		try {
			const res = await send([
				transaction(REVEAL),
				args([
					arg(String(nftID), t.UInt64),
					arg(String(rewardItemID), t.UInt32),
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
			setRerender(true);
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
			<div className="grid grid-cols-5 gap-x-4 gap-y-6 overflow-auto">
				{rewards
					.filter((item: any) => !item.revealed)
					.map((item: any) => (
						<Reward key={item.id} item={item} />
					))}
			</div>
		</div>
	);
};

export default Rewards;
