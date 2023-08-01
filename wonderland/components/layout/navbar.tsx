'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function NavBar() {
	return (
		<nav>
			<div
				className={`fixed top-0 w-full flex justify-center z-30 transition-all`}
			>
				<div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between w-full">
					<Link
						href="/"
						className="flex items-center font-display text-2xl"
					>
						<div className="flex items-center flex-shrink-0 text-white mr-6">
							<span
								className="rounded-full bg-white bg-opacity-30 hover:bg-opacity-50 transition-all p-1.5 px-2 font-semibold text-xl tracking-tight font-wonderland"
								style={{ textShadow: '1px 1px #000' }}
							>
								W
							</span>
						</div>
					</Link>
					<div>
						<div className="text-sm lg:flex-grow">
							<Link href="/dashboard">
								<span className="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4">
									Dashboard
								</span>
							</Link>
							<Link href="/raids">
								<span className="block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4">
									Raids
								</span>
							</Link>
							<button className="rounded-full border border-white p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black">
								Connect
							</button>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
