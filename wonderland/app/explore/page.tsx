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
	const [inceptionOpen, setInceptionOpen] = useState(false);

	return (
		<>
			<div className="hidden lg:flex">
				{/* <MusicToggle audioUrl="/adventure.mp3" /> */}
			</div>
			<div className="hidden lg:flex min-h-screen items-center justify-center bg-center bg-no-repeat bg-cover">
				<MapWithMarkers
					setModalOpen={setModalOpen}
					setFlovatarOpen={setFlovatarOpen}
				/>
			</div>
			<div className="lg:hidden flex min-h-screen items-center justify-center text-xl">
				We recommend using Desktop
			</div>
			<ProjectNavigation
				setModalOpen={setModalOpen}
				setFlovatarOpen={setFlovatarOpen}
				setInceptionOpen={setInceptionOpen}
			/>
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
