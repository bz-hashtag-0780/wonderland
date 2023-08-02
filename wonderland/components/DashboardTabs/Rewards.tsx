import React from 'react';
import Image from 'next/image';

const Rewards = () => {
	const dummyData = [
		{
			name: 'Beasts',
			image: 'https://basicbeasts.io/_next/static/image/public/fungible_tokens/fungible_tokens_thumbnails/empty_potion_bottle_thumbnail_v2.f2afb9445a18c3bd70ad263a5673b45d.png',
		},
		{
			name: 'Rewards',
			image: 'https://basicbeasts.io/_next/static/image/public/fungible_tokens/fungible_tokens_thumbnails/empty_potion_bottle_thumbnail_v2.f2afb9445a18c3bd70ad263a5673b45d.png',
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
						<button className="justify-center bg-white bg-opacity-80 h-5 px-3 hover:opacity-100 flex items-center rounded-full text-sm drop-shadow text-black transition ease-in-out duration-100 group-hover:opacity-100">
							Reveal
						</button>
					</div>
				</div>
			</div>
			<div className="flex flex-initial flex-col p-2">
				<div className="truncate mt-1">
					<div className="flex items-center justify-between gap-x-2 flex-wrap h-7 overflow-hidden">
						<span className="flex items-center gap-1 text-xs text-white-2 min-w-0 min-h-[28px]">
							Rewards
						</span>
						<p className="text-xs px-2 rounded-lg leading-snug text-white bg-white bg-opacity-30 border border-transparent">
							Epic
						</p>
					</div>
				</div>
			</div>
		</div>
	);

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

export default Rewards;
