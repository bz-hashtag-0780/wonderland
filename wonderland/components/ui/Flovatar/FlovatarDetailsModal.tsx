import React from 'react';
import rewardTemplates from 'data/rewardTemplates';
import Image from 'next/image';

interface DetailsModalProps {
	flovatar: any;
	onClose: () => void;
	rewards: any;
}

const computeRewards = (nftId: string, rewards: any) => {
	const count: { [key: string]: number } = {};

	// Create a lookup object for reward templates
	const rewardNameLookup: { [key: number]: string } = {};
	rewardTemplates.forEach((template) => {
		rewardNameLookup[template.rewardItemTemplateID] = template.emoji;
	});

	Object.values(rewards[nftId]).forEach((rewardItem: any) => {
		if (rewardItem.revealed) {
			count[rewardItem.rewardTemplateID] =
				(count[rewardItem.rewardTemplateID] || 0) + 1;
		} else {
			count['unknown'] = (count['unknown'] || 0) + 1;
		}
	});

	const sortedEntries = Object.entries(count).sort(([keyA], [keyB]) => {
		if (keyA === 'unknown') return -1;
		if (keyB === 'unknown') return 1;
		return 0;
	});

	return sortedEntries.map(([templateID, countValue]) => (
		<p key={templateID}>
			{templateID === 'unknown'
				? '❓'
				: rewardNameLookup[Number(templateID)]}
			: {countValue}x
		</p>
	));
};

const FlovatarDetailsModal: React.FC<DetailsModalProps> = ({
	flovatar,
	onClose,
	rewards,
}) => {
	return (
		<div className="fixed inset-0 flex justify-center items-center z-50">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black opacity-50"
				onClick={onClose}
			></div>

			{/* Modal Content */}
			<div className="relative rounded-md p-6 max-w-lg w-full bg-black bg-opacity-80 p-5 mx-2 text-white">
				<h2 className="text-xl font-bold mb-4">Flovatar Details</h2>

				<div className="flex mb-4">
					{/* First Column: Image */}
					<div className="flex-1 mr-4">
						<Image
							src={
								'https://images.flovatar.com/flovatar/png/' +
								flovatar?.id +
								'.png'
							}
							alt={flovatar?.nickname}
							width={200}
							height={200}
							className="rounded-md"
						/>
					</div>

					{/* Second Column: Information */}
					<div className="flex-1">
						<p>
							<strong>Name:</strong> Flovatar #{flovatar?.id}
						</p>
						<p>
							<strong>ID:</strong> #{flovatar?.uuid}
						</p>

						{/* Add more details as needed */}
						{rewards[flovatar?.uuid] ? (
							computeRewards(flovatar?.uuid, rewards)
						) : (
							<p>No rewards found for this NFT.</p>
						)}
					</div>
				</div>

				{/* Close button */}
				<button
					onClick={onClose}
					className="mt-4 p-2 bg-transparent text-white rounded-md hover:bg-white hover:text-black focus:outline-none border border-white"
				>
					Close
				</button>
			</div>
		</div>
	);
};

export default FlovatarDetailsModal;
