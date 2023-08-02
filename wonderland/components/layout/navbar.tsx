'use client';

import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

export default function NavBar() {
	return (
		<nav>
			<div
				className={`fixed top-0 w-full flex justify-center z-30 transition-all`}
			>
				<div className="mx-5 flex h-16 max-w-screen-xl items-center justify-between w-full">
					<MobileMenu />
					<DesktopMenu />
				</div>
			</div>
		</nav>
	);
}
