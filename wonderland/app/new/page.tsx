'use client';

import MapWithMarkers from '@/components/ui/MapWithMarkers';
import QuestingModal from '@/components/ui/QuestingModal';
import React, { useState } from 'react';
import { useWonder } from 'providers/WonderProvider';
import MusicToggle from '@/components/ui/MusicToggle';
import ProjectNavigation from '@/components/ui/ProjectNavigation';

export default function New() {
	const [isModalOpen, setModalOpen] = useState(false);
	//todo add flovatar
	const { beastz } = useWonder();
	return (
		<>
			<MusicToggle audioUrl="/adventure.mp3" />
			<div className="min-h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover">
				<MapWithMarkers setModalOpen={setModalOpen} />
			</div>
			<ProjectNavigation setModalOpen={setModalOpen} />
			<QuestingModal
				questingResources={beastz}
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</>
	);
}
