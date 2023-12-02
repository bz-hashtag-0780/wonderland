'use client';

import MapWithMarkers from '@/components/ui/MapWithMarkers';
import QuestingModal from '@/components/ui/QuestingModal';
import React, { useState } from 'react';
import { useWonder } from 'providers/WonderProvider';
import MusicToggle from '@/components/ui/MusicToggle';
import ProjectNavigation from '@/components/ui/ProjectNavigation';
import FlovatarModal from '@/components/ui/FlovatarModal';

export default function New() {
	const { beastz, flovatar } = useWonder();
	const [isModalOpen, setModalOpen] = useState(false);
	const [flovatarOpen, setFlovatarOpen] = useState(false);

	return (
		<>
			<MusicToggle audioUrl="/adventure.mp3" />
			<div className="min-h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover">
				<MapWithMarkers
					setModalOpen={setModalOpen}
					setFlovatarOpen={setFlovatarOpen}
				/>
			</div>
			<ProjectNavigation setModalOpen={setModalOpen} />
			<QuestingModal
				questingResources={beastz}
				isOpen={isModalOpen}
				onClose={() => setModalOpen(false)}
			/>
			<FlovatarModal
				questingResources={flovatar}
				isOpen={flovatarOpen}
				onClose={() => setFlovatarOpen(false)}
			/>
		</>
	);
}
