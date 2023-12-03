const FlovatarRewardTableModal = ({ isOpen, onClose }: any) => {
	return (
		isOpen && (
			<div className="fixed inset-0 flex justify-center items-center z-50">
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-black opacity-50"
					onClick={onClose}
				></div>
				<div className="bg-black p-6 rounded-lg shadow-xl max-w-xl z-10">
					<table className="min-w-full text-white divide-y divide-gray-200 text-center">
						<thead>
							<tr>
								<th className="py-2 px-4"></th>
								<th className="py-2 px-4">🟣 Traveler</th>
								<th className="py-2 px-4">🔵 Super</th>
								<th className="py-2 px-4">🟡 Unearthly</th>
								<th className="py-2 px-4">⚛️ Divine</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-300">
							<tr>
								<td className="py-2 px-4">Flovatar</td>
								<td className="py-2 px-4">55%</td>
								<td className="py-2 px-4">36%</td>
								<td className="py-2 px-4">8%</td>
								<td className="py-2 px-4">1%</td>
							</tr>
						</tbody>
					</table>

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

export default FlovatarRewardTableModal;
