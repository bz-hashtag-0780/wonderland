import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';

const UserLoggedInDropdown = ({ user, logOut }: any) => (
	<Popover className="relative">
		{({ open }) => (
			<>
				<Popover.Button
					className={`rounded-full border border-white p-1.5 px-4 text-sm text-white transition-all hover:bg-white hover:text-black ${
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
					<Popover.Panel className="absolute z-10 max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/2 sm:px-0">
						<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
							<div className="relative grid gap-6 bg-white p-3">
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

export default UserLoggedInDropdown;
