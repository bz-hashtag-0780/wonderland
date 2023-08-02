import { useState } from 'react';
import Link from 'next/link';

const navItems = [
	{ name: 'Home', href: '/' },
	{ name: 'Dashboard', href: '/dashboard' },
	{ name: 'Raids', href: '/raids' },
];

const ConnectButton = () => (
	<button className="mt-4 rounded-full border border-white p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black">
		Connect
	</button>
);

const NavItem = ({ item }: any) => (
	<Link href={item.href}>
		<span className="cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white">
			{item.name}
		</span>
	</Link>
);

export default function MobileMenu() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div className="flex lg:hidden justify-between w-full z-10 text-white">
				<div></div>
				<button onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="h-6 w-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					) : (
						<svg
							className="menuIcon h-6 w-6"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Menu</title>
							<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v15z" />
						</svg>
					)}
				</button>
			</div>
			<div
				className={`lg:hidden ${
					isOpen
						? 'flex fixed top-0 left-0 w-full h-full items-center justify-center bg-black bg-opacity-50'
						: 'hidden'
				}`}
			>
				<div
					className="flex flex-col items-center"
					onClick={() => setIsOpen(false)}
				>
					{navItems.map((item) => (
						<NavItem key={item.name} item={item} />
					))}
					<ConnectButton />
				</div>
			</div>
		</>
	);
}
