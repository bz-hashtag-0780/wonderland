'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

const RaidCockpit = ({ setOpenRaidProfile, setOpenChooseBeast }: any) => {
	const { data: session }: any = useSession();
	const Info = ({ value, label, lastItem }: any) => (
		<div
			className={`flex flex-col relative h-auto bg-opacity-10 bg-white rounded-xl w-full p-4 mt-0 ${
				lastItem ? '' : 'mr-4'
			}`}
		>
			<div className="flex text-white opacity-40 text-sm">{label}</div>
			<div className="flex text-2xl font-bold">{value}</div>
		</div>
	);

	return (
		<div className="w-full max-w-5xl bg-custom-orange bg-opacity-10 p-8 rounded-lg mx-2 text-white border border-custom-orange">
			<div className="flex uppercase font-bold text-3xl justify-center mb-4">
				Raid Cockpit
			</div>
			<div className="flex w-full flex-col">
				<div className="flex flex-col">
					<div className="flex">
						<div>
							<div className="relative overflow-hidden w-full bg-transparent rounded-xl">
								<Image
									alt={'something'}
									src={
										'https://basicbeasts.mypinata.cloud/ipfs/QmdWciz9H88fu2jT1Mfu3LszJuBjvjwbW1zh77135aEukE'
									}
									width={400}
									height={400}
									priority={true}
								/>
							</div>
						</div>
						<div className="ml-4 w-full">
							<div className="flex w-full mb-4">
								<Info value={'#3233'} label={'Beast'} />
								<Info
									value={'Joined Raid'}
									label={'Status'}
									lastItem={true}
								/>
							</div>
							<div className="flex w-full mb-4">
								<Info value={'200'} label={'EXP Points'} />
								<Info value={'3'} label={'Sushi'} />
								<Info
									value={'2'}
									label={'Ice Cream'}
									lastItem={true}
								/>
							</div>
							<div className="border-t border-white opacity-20 mb-1"></div>
							<div>
								<div className="mb-4 uppercase">
									beast season metrics
								</div>
								<div className="flex w-full mb-4">
									<Info
										value={'20 - 3'}
										label={'Win - Lose'}
									/>
									<Info
										value={'200'}
										label={'Raid Points'}
										lastItem={true}
									/>
								</div>
								<div className="flex w-full">
									<Info
										value={'18 - 2'}
										label={'Sushi W - L'}
									/>
									<Info
										value={'2 - 1'}
										label={'Ice Cream W - L'}
										lastItem={true}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="border-t border-white opacity-20 mt-4 mb-1"></div>
					<div>
						<div className="mb-4 uppercase">
							wallet season metrics
						</div>
						<div
							onClick={() => console.log(session.user)}
							className="flex w-full mb-4"
						>
							<Info
								value={
									session && session.user
										? session.user.name
										: ''
								}
								label={'Discord'}
							/>
							<Info value={'200'} label={'Total W - L'} />
							<Info value={'200'} label={'Raids'} />
							<Info
								value={'190'}
								label={'Raided'}
								lastItem={true}
							/>
						</div>
						<div className="flex w-full">
							<Info value={'18-2'} label={'Sushi W-L'} />
							<Info value={'2 - 1'} label={'Ice Cream W-L'} />
							<Info
								value={'200'}
								label={'Total Raid Points'}
								lastItem={true}
							/>
						</div>
					</div>
				</div>
				<div className="border-t border-white opacity-20 mt-6 mb-1"></div>
				<div>
					<button
						onClick={() => setOpenRaidProfile(true)}
						className="flex justify-center items-center mt-6 border border-solid text-white hover:bg-white hover:text-black text-2xl py-1 px-4 w-full h-16 rounded-md font-bold transition duration-150 ease-in-out"
					>
						Edit Raid Profile
					</button>
				</div>
			</div>
		</div>
	);
};

export default RaidCockpit;
