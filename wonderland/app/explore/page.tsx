'use client';

import React, { useState } from 'react';
import '../../flow-config.js';
import QuestingBeastzModal from '@/components/ui/QuestingBeastzModal';

export default function Explore() {
	const [isModalOpen, setModalOpen] = useState(false);

	return (
		<>
			<div className="min-h-screen flex pt-20 pb-20 justify-center bg-center bg-no-repeat bg-cover bg-black">
				<button
					className="text-white"
					onClick={() => setModalOpen(true)}
				>
					test
				</button>
			</div>
			<QuestingBeastzModal
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</>
	);
}
