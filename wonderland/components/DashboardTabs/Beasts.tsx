import React from 'react';
import Image from 'next/image';

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
	];

	const NFT = ({ item }: any) => (
		<div className="p-0 mb-4 border border-solid border-white-500 rounded-xl overflow-hidden">
			<div className="flex-auto flex flex-col w-full group relative">
				<div className="rounded-xl overflow-hidden flex items-center relative">
					<div className="cursor-pointer">
						<Image
							alt={item.name}
							src={item.image}
							width={400}
							height={400}
						/>
					</div>
					<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
						<button className="justify-center bg-white bg-opacity-80 h-5 px-3 hover:opacity-80 flex items-center rounded-full text-sm drop-shadow text-black transition ease-in-out duration-100 group-hover:opacity-100">
							Quest
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-initial flex-col p-3 pb-0">
				<div>info</div>
				<div>stuff</div>
			</div>
		</div>
	);

	return (
		<div className="p-6">
			<div className="grid grid-cols-4 gap-x-4 gap-y-6 overflow-auto">
				{dummyData.map((item) => (
					<NFT key={item.name} item={item} />
				))}
			</div>
		</div>
	);
};

export default Beasts;
