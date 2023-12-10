import rewardTemplates from 'data/rewardTemplates';
import { filterAndGroupRewards } from '@/utils/filterAndGroupRewards';

const FlovatarRevealedModal = ({ isOpen, onClose, revealedRewards }: any) => {
	return (
		isOpen && (
			<div className="fixed inset-0 flex justify-center items-center z-50">
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black opacity-50"
					onClick={onClose}
				></div>
				<div className="bg-black p-6 rounded-lg shadow-xl w-1/3 max-w-3xl z-10">
					<div className="flex w-full justify-center items-center">
						<h2 className="text-2xl font-bold uppercase tracking-wide">
							Revealed
						</h2>
					</div>
					<div className="flex justify-center items-center border rounded-lg w-full p-4 mt-4 mb-6">
						<div className="p-2">
							<div className="px-2.5 font-bold border border-solid rounded-full bg-white text-black transition-colors duration-150 focus:outline-none">
								i
							</div>
						</div>
						<div className="ml-4">
							{revealedRewards.length > 1
								? 'Your rewards have been revealed!'
								: 'Your reward has been revealed!'}
						</div>
					</div>
					<div className="flex flex-col">
						{filterAndGroupRewards(revealedRewards).map(
							(item: any) => (
								<div
									key={item.id}
									className="flex justify-between text-base mt-4"
								>
									<p>
										{
											(
												rewardTemplates.find(
													(template: any) =>
														template.rewardItemTemplateID ===
															item.rewardItemTemplateID &&
														template.type ===
															'Flovatar'
												) || {
													type: 'Flovatar',
													rewardItemTemplateID: 1,
													name: 'Unrevealed',
													description: '',
													image: '/images/basicBeasts/unknown.png',
												}
											).emoji
										}
										&nbsp;
										{
											(
												rewardTemplates.find(
													(template: any) =>
														template.rewardItemTemplateID ===
															item.rewardItemTemplateID &&
														template.type ===
															'Flovatar'
												) || {
													type: 'Flovatar',
													rewardItemTemplateID: 1,
													name: 'Unrevealed',
													description: '',
													image: '/images/basicBeasts/unknown.png',
												}
											).name
										}
									</p>
									<p>{item.count}</p>
								</div>
							)
						)}
						<div
							className="flex my-4 h-px w-full"
							style={{
								backgroundColor: 'rgba(255, 255, 255, 0.12)',
							}}
						/>
						<div className="flex justify-between text-xl">
							<p>Total Rewards</p>
							<p>{revealedRewards.length}</p>
						</div>
					</div>

					<button
						onClick={onClose}
						className="flex justify-center items-center mt-4 border border-solid text-white hover:bg-white hover:text-black text-2xl py-1 px-4 w-full h-16 rounded-md font-bold transition duration-150 ease-in-out"
					>
						LFG!
					</button>
				</div>
			</div>
		)
	);
};

export default FlovatarRevealedModal;
