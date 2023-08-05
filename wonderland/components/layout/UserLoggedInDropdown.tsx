import { Fragment, useState, useRef, useEffect } from 'react';
import { Popover, Transition } from '@headlessui/react';

const UserLoggedInDropdown = ({ user, logOut }: any) => {
	const [buttonWidth, setButtonWidth] = useState(0);
	const ref: any = useRef(null);

	useEffect(() => {
		if (ref.current) {
			setButtonWidth(ref.current.getBoundingClientRect().width);
		}
	}, []);

	return (
		<Popover className="relative" ref={ref}>
			{({ open }) => (
				<>
					<Popover.Button
						className={`rounded-full border border-white p-1.5 px-4 text-sm transition-all hover:bg-white hover:text-black focus:outline-none ${
							open ? 'bg-white text-black' : ''
						}`}
					>
						{user?.addr
							.slice(0, 5)
							.concat('...')
							.concat(user?.addr.slice(-4))}
					</Popover.Button>
					<Transition
						as={Fragment}
						enter="transition ease-out duration-200"
						enterFrom="opacity-0 translate-y-1"
						enterTo="opacity-100 translate-y-0"
						leave="transition ease-in duration-150"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 translate-y-1"
					>
						<Popover.Panel
							className="absolute z-10 px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0"
							style={{ width: buttonWidth }}
						>
							<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
								<div className="relative grid gap-6 bg-white p-1">
									<button
										onClick={() => logOut()}
										className="hover:bg-gray-100 p-1 rounded-lg font-medium text-gray-900"
									>
										Sign out
									</button>
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	);
};

export default UserLoggedInDropdown;
