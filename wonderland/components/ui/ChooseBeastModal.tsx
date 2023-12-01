import Image from 'next/image';
import { useAuth } from 'providers/AuthProvider';
import { useUser } from 'providers/UserProvider';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const ChooseBeastModal = ({ isOpen, onClose }: any) => {
	const {
		stakedBeasts,
		fetchUserBeasts,
		rewards,
		getRewards,
		// userOptIn,
		// raidBeast,
	} = useUser();
	const userOptIn = null;
	const raidBeast = null;
	const { user } = useAuth();
	const { data: session }: any = useSession();

	// useEffect(() => {
	// 	if (user?.addr != null) {
	// 		fetchUserBeasts();
	// 	}
	// 	getRewards();
	// }, [user?.addr]);

	const Reward = ({ value, label }: any) => (
		<div
			className={
				'flex flex-col relative h-auto bg-opacity-10 bg-white rounded-xl w-full p-4 mt-0'
			}
		>
			<div className="flex text-white opacity-40 text-sm">{label}</div>
			<div className="flex text-2xl font-bold">{value}</div>
		</div>
	);

	const Beast = ({ beast }: any) => (
		<div className="flex flex-col gap-2 group">
			<div className="flex gap-4">
				<div className="w-full">
					<div className="relative overflow-hidden w-full bg-transparent rounded-xl">
						<div className="flex w-full absolute z-10 top-2">
							<div className="z-10 flex justify-center items-center absolute top-0 right-2 bg-white bg-opacity-80 rounded text-black text-xs font-semibold px-1.5 py-0.5">
								{raidBeast == beast.id ? (
									'⚔️ Raiding'
								) : (
									<>
										{beast.name} #{beast.serial}
									</>
								)}
							</div>
						</div>
						<Image
							alt={'something'}
							src={
								'https://basicbeasts.mypinata.cloud/ipfs/' +
								beast.image
							}
							width={200}
							height={200}
							priority={true}
						/>
						<div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
							<button
								disabled={!session}
								onClick={() => {
									// userOptIn(beast.id, session.user.discordId);
								}}
								className="justify-center bg-white bg-opacity-70 min-w-max px-4 py-1 hover:bg-opacity-100 flex items-center rounded-full text-md drop-shadow text-black transition ease-in-out duration-100 group-hover:opacity-100"
							>
								Select
							</button>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full w-2/3 gap-4">
					<Reward value={beast.sushiCount} label={'Sushi'} />
					<Reward value={beast.iceCreamCount} label={'Ice Cream'} />
				</div>
			</div>
		</div>
	);

	function transform(beasts: any[], rewards: any) {
		const result = beasts
			.map((beast) => {
				const beastRewards = rewards[beast.id];

				let sushiCount = 0;
				let iceCreamCount = 0;

				if (beastRewards) {
					for (const key in beastRewards) {
						const reward = beastRewards[key];
						if (reward.revealed) {
							if (reward.rewardItemTemplateID === '1')
								sushiCount++;
							if (reward.rewardItemTemplateID === '2')
								iceCreamCount++;
						}
					}
				}

				return {
					id: beast.id,
					serial: beast.serialNumber,
					name: beast.beastTemplate.name,
					image: beast.beastTemplate.image,
					sushiCount,
					iceCreamCount,
				};
			})
			.filter((item) => item.sushiCount > 0 || item.iceCreamCount > 0);

		return result;
	}

	const filteredBeasts = transform(stakedBeasts, rewards);

	return (
		isOpen && (
			<div className="fixed inset-0 flex justify-center items-center z-50 text-white">
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black opacity-50"
					onClick={onClose}
				></div>
				<div className="bg-black p-6 rounded-lg shadow-xl w-3/5 max-w-3xl z-10">
					<div className="flex w-full justify-center items-center mb-6">
						<h2 className="text-2xl font-bold uppercase tracking-wide text-white">
							Choose Your Beast
						</h2>
					</div>
					<div className="flex justify-center items-center border rounded-lg w-full p-4 mt-4 mb-6">
						<div className="p-2">
							<div className="px-2.5 font-bold border border-solid rounded-full bg-white text-black transition-colors duration-150 focus:outline-none">
								i
							</div>
						</div>
						<div className="ml-4">
							Choose your Beast wisely, they will represent you in
							your raids. Rewards owned by the Beast can be
							stolen.
						</div>
					</div>
					{filteredBeasts.length > 0 ? (
						<div className="flex flex-col text-lg">
							<div className="h-[300px] overflow-y-auto">
								<div className="grid grid-cols-2 gap-4">
									{filteredBeasts.map((beast: any) => (
										<Beast key={beast.id} beast={beast} />
									))}
								</div>
							</div>
						</div>
					) : (
						<div className="text-lg p-6">
							You don´t have any staked beasts with sushi or ice
							cream to join the raid
						</div>
					)}
					<button
						onClick={onClose}
						className="flex justify-center items-center mt-6 border border-solid text-white hover:bg-white hover:text-black text-2xl py-1 px-4 w-full h-16 rounded-md font-bold transition duration-150 ease-in-out"
					>
						Close
					</button>
				</div>
			</div>
		)
	);
};

export default ChooseBeastModal;
