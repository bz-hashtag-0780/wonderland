import Link from 'next/link';
import { useAuth } from 'providers/AuthProvider';

const navItems = [
	{ name: 'Dashboard', href: '/dashboard' },
	{ name: 'Raids', href: '/raids' },
];

const ConnectButton = ({ logIn }: any) => (
	<button
		onClick={() => logIn()}
		className="rounded-full border border-white p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black"
	>
		Connect
	</button>
);

const NavItem = ({ item }: any) => (
	<Link href={item.href}>
		<span className="cursor-pointer block mt-4 lg:inline-block lg:mt-0 text-gray-200 hover:text-white mr-4">
			{item.name}
		</span>
	</Link>
);

export default function DesktopMenu() {
	const { user, loggedIn, logIn, logOut } = useAuth();

	return (
		<div className="hidden lg:flex items-center justify-between w-full">
			<Link href="/">
				<span className="cursor-pointer flex items-center font-display text-2xl">
					<div className="flex items-center flex-shrink-0 text-white mr-6">
						<span
							className="rounded-full bg-white bg-opacity-30 hover:bg-opacity-50 transition-all p-1.5 px-2 font-semibold text-xl tracking-tight font-wonderland"
							style={{ textShadow: '1px 1px #000' }}
						>
							W
						</span>
					</div>
				</span>
			</Link>
			<div className="text-sm lg:flex-grow flex items-center justify-end text-white">
				{navItems.map((item) => (
					<NavItem key={item.name} item={item} />
				))}
				{loggedIn ? (
					<button onClick={() => logOut()}>Sign out</button>
				) : (
					<ConnectButton logIn={logIn} />
				)}
			</div>
		</div>
	);
}
