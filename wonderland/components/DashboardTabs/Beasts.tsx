'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import {
	query,
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
import '../../flow-config.js';
import { STAKE } from '../../flow/txns/stake.js';

const Beasts = () => {
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
		{
			name: 'Random',
			image: 'https://basicbeasts.mypinata.cloud/ipfs/QmStptQqKw1aoa1U4MUF64KaxGYAx2WRoGkBuafHkLoJyD',
		},
		{
			name: 'Random',
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
					<div>
						<Image
							alt={item.name}
							src={item.image}
							width={400}
							height={400}
						/>
					</div>
					<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<button
							onClick={() => quest()}
							className="justify-center bg-white bg-opacity-80 h-5 px-3 hover:opacity-100 flex items-center rounded-full text-sm drop-shadow text-black transition ease-in-out duration-100 group-hover:opacity-100"
						>
							Quest
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-initial flex-col p-2">
				<div className="truncate mt-1">
					<div className="flex items-center justify-between gap-x-2 flex-wrap h-7 overflow-hidden">
						<span className="flex items-center gap-1 font-bold text-white-2 min-w-0 min-h-[28px]">
							#69
						</span>
						<span className="flex items-center gap-1 text-white-2 text-sm min-w-0 min-h-[28px]">
							4/7d
						</span>
					</div>
				</div>
				<div className="truncate mt-1">
					<div className="flex items-center justify-between gap-x-2 flex-wrap h-7 overflow-hidden">
						<span className="flex items-center gap-1 text-white-2 text-sm min-w-0 min-h-[28px]">
							Rewards: 3
						</span>
						<button className="text-sm text-pink-primary border border-solid shadow \ border-white hover:bg-white hover:border-white hover:text-black \ px-1.5 py-0.5 rounded transition-[background-color,border-color,color] ease-in-out duration-100 xs:block">
							Details
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const fetchUserBeasts = async () => {
		try {
			let res = await query({
				cadence: `
            import BasicBeasts from 0xBasicBeasts
            
            pub fun main(acct: Address): [AnyStruct] {
                var beastCollection: [AnyStruct] = []
            
                let collectionRef = getAccount(acct).getCapability(BasicBeasts.CollectionPublicPath)
                    .borrow<&{BasicBeasts.BeastCollectionPublic}>()
    
                if(collectionRef != nil) {
                    let beastIDs = collectionRef!.getIDs()
            
                    for id in beastIDs {
                        let borrowedBeast = collectionRef!.borrowBeast(id: id)!
                        beastCollection.append(borrowedBeast)
                    }
                }
              return beastCollection
            }
            `,

				args: (arg: any, t: any) => [
					arg('0x4742010dbfe107da', t.Address),
				],
			});
			console.log(res);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchUserBeasts();
	}, []);

	const quest = async () => {
		try {
			const res = await send([
				transaction(STAKE),
				args([arg('125368043', t.UInt64)]),
				payer(authz),
				proposer(authz),
				authorizations([authz]),
				limit(9999),
			]).then(decode);
			tx(res).subscribe((res: any) => {
				console.log(res.status);
			});
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className="pt-6">
			<div className="grid grid-cols-4 gap-x-4 gap-y-6 overflow-auto">
				{dummyData.map((item) => (
					<NFT key={item.name} item={item} />
				))}
			</div>
		</div>
	);
};

export default Beasts;
