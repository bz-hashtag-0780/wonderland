const ChooseBeastModal = ({ isOpen, onClose }: any) => {
	return (
		isOpen && (
			<div className="fixed inset-0 flex justify-center items-center z-50 text-white">
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black opacity-50"
					onClick={onClose}
				></div>
				<div className="bg-black p-6 rounded-lg shadow-xl w-3/5 max-w-3xl overflow-scroll z-10">
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
					<div className="flex flex-col text-lg">
						<div>Beast</div>
					</div>
					<button
						onClick={onClose}
						className="flex justify-center items-center mt-6 border border-solid text-white hover:bg-white hover:text-black text-2xl py-1 px-4 w-full h-16 rounded-md font-bold transition duration-150 ease-in-out"
					>
						Save
					</button>
				</div>
			</div>
		)
	);
};

export default ChooseBeastModal;
