'use client';

import React from 'react';

export default function Raids() {
	return (
		<div className="min-h-screen flex pt-20 pb-20 justify-center bg-center bg-no-repeat bg-cover bg-black">
			<div className="w-full max-w-5xl bg-custom-orange bg-opacity-10 p-5 rounded-lg mx-2 text-white border border-custom-orange">
				<div className="flex uppercase font-bold text-xl justify-center">
					Raid Cockpit
				</div>
				<div className="flex w-full flex-col">
					<div className="flex flex-col">
						<div></div>
						<div>wallet metrics</div>
					</div>
					<div>
						<button className="flex justify-center items-center mt-4 border border-solid text-white hover:bg-white hover:text-black text-2xl py-1 px-4 w-full h-16 rounded-md font-bold transition duration-150 ease-in-out">
							Edit Raid Profile
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
