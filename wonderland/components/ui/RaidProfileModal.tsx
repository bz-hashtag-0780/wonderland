import { useSession, signIn, signOut } from 'next-auth/react';
import { useUser } from 'providers/UserProvider';

const RaidProfileModal = ({ isOpen, onClose, setOpenChooseBeast }: any) => {
	const { data: session } = useSession();
	const { beasts, raidBeast } = useUser();
	return (
		isOpen && (
			<div className="fixed inset-0 flex justify-center items-center z-50 text-white">
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black opacity-50"
					onClick={onClose}
				></div>
				<div className="bg-black bg-opacity-80 p-6 rounded-lg shadow-xl w-2/3 max-w-3xl overflow-scroll z-10">
					<div className="flex w-full justify-center items-center mb-6">
						<h2 className="text-2xl font-bold uppercase tracking-wide text-white">
							My Raid Profile
						</h2>
					</div>
					<div className="flex flex-col text-lg">
						<div className="flex justify-between items-center mb-4">
							<div className="flex w-full">
								Discord:&nbsp;
								<span className="font-bold">
									{session && session.user
										? session.user.name
										: ''}
								</span>
							</div>
							{session && session.user ? (
								<button
									onClick={() => signOut()}
									className="flex w-full justify-center border border-solid rounded-md py-1 px-4 hover:bg-white hover:text-black"
								>
									Disconnect Discord
								</button>
							) : (
								<button
									onClick={() => signIn('discord')}
									className="flex w-full justify-center border border-solid rounded-md py-1 px-4 hover:bg-white hover:text-black"
								>
									Connect Discord
								</button>
							)}
						</div>
						<div className="flex justify-between items-center">
							<div className="flex w-full">
								Beast:&nbsp;
								<span className="font-bold">
									{raidBeast && (
										<>
											{
												beasts.filter(
													(beast: any) =>
														raidBeast == beast.id
												)[0].nickname
											}{' '}
											#
											{
												beasts.filter(
													(beast: any) =>
														raidBeast == beast.id
												)[0].serialNumber
											}
										</>
									)}
								</span>
							</div>
							{session && session.user ? (
								<button
									onClick={() => setOpenChooseBeast(true)}
									className="flex w-full justify-center border border-solid rounded-md py-1 px-4 hover:bg-white hover:text-black"
								>
									Choose Beast
								</button>
							) : (
								<></>
							)}
						</div>
					</div>

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

export default RaidProfileModal;
