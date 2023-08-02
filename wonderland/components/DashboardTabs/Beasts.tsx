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
		<div className="tw-p-0 mb-4 grid-card grid-card__main tw-border tw-border-solid tw-border-gray-500 tw-rounded-xl tw-overflow-hidden">
			<div>
				<div>
					<Image
						alt={item.name}
						src={item.image}
						width={500}
						height={300}
					/>
				</div>
				<div>info</div>
				<button></button>
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
