'use client';

import MapWithMarkers from '@/components/ui/MapWithMarkers';
import QuestingModal from '@/components/ui/QuestingModal';
import React, { useState } from 'react';
import { useWonder } from 'providers/WonderProvider';
import MusicToggle from '@/components/ui/MusicToggle';

export default function New() {
	const [isModalOpen, setModalOpen] = useState(false);

	const { beastz } = useWonder();
	return (
		<>
			<MusicToggle audioUrl="/adventure.mp3" />
			<div className="min-h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover">
				<MapWithMarkers setModalOpen={setModalOpen} />
			</div>
			<QuestingModal
				questingResources={beastz}
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</>
	);
}
