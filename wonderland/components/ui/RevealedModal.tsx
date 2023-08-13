const RevealedModal = ({ isOpen, onClose }: any) => {
	return (
		isOpen && (
			<div className="fixed inset-0 flex justify-center items-center z-50">
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black opacity-50"
					onClick={onClose}
				></div>
				<div className="bg-black bg-opacity-80 p-6 rounded-lg shadow-xl w-1/3 max-w-3xl overflow-scroll z-10">
					<div className="flex w-full justify-center items-center">
						<h2 className="text-2xl font-bold uppercase tracking-wide">
							Revealed
						</h2>
					</div>
					<div className="flex justify-center items-center border rounded-lg w-full p-4 px-6 mt-4 mb-6">
						<div>Your rewards have been revealed!</div>
					</div>
					<div className="flex flex-col">
						<div className="flex justify-between text-base mt-4">
							<p>Sushi</p>
							<p>1</p>
						</div>
						<div
							className="flex my-4 h-px w-full"
							style={{
								backgroundColor: 'rgba(255, 255, 255, 0.12)',
							}}
						/>
						<div className="flex justify-between text-xl">
							<p>Total Rewards</p>
							<p>1</p>
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

export default RevealedModal;
