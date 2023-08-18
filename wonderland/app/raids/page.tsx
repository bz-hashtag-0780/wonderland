'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import RaidCockpit from '@/components/raidsContent/RaidCockpit';
import RaidProfileModal from '@/components/ui/RaidProfileModal';
import ChooseBeastModal from '@/components/ui/ChooseBeastModal';
import Leaderboard from '@/components/raidsContent/Leaderboard';

export default function Raids() {
	const [openRaidProfile, setOpenRaidProfile] = useState(false);
	const [openChooseBeast, setOpenChooseBeast] = useState(false);
	return (
		<div className="min-h-screen flex flex-col pt-20 pb-20 justify-center items-center bg-center bg-no-repeat bg-cover bg-black">
			<RaidCockpit setOpenRaidProfile={setOpenRaidProfile} />
			<Leaderboard />
			<RaidProfileModal
				isOpen={openRaidProfile}
				onClose={() => setOpenRaidProfile(false)}
				setOpenChooseBeast={setOpenChooseBeast}
			/>
			<ChooseBeastModal
				isOpen={openChooseBeast}
				onClose={() => setOpenChooseBeast(false)}
			/>
		</div>
	);
}
