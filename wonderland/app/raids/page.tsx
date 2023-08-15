'use client';

import Image from 'next/image';
import React from 'react';
import RaidCockpit from '@/components/raidsContent/RaidCockpit';

export default function Raids() {
	return (
		<div className="min-h-screen flex flex-col pt-20 pb-20 justify-center items-center bg-center bg-no-repeat bg-cover bg-black">
			<RaidCockpit />
			<div className="text-white">leaderboard</div>
		</div>
	);
}
