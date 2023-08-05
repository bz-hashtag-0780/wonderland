'use client';

import React, { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';
import { useAuth } from 'providers/AuthProvider';

export default function Home() {
	const { user, logIn, logOut } = useAuth();

	return (
		<div
			className="min-h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover"
			style={{ backgroundImage: `url(/background/landscape.png)` }}
		>
			<header className="p-5 text-center">
				<h1
					className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-wonderland text-white"
					style={{ textShadow: '2px 2px #000' }}
				>
					Wonderland
				</h1>
			</header>
		</div>
	);
}
