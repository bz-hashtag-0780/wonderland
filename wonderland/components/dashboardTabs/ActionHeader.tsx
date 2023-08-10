import React from 'react';

interface ActionHeaderProps {
	buttonText?: string;
	action: any;
}

const ActionHeader: React.FC<ActionHeaderProps> = ({
	buttonText = 'Reveal All',
	action,
}) => {
	return (
		<div className="flex justify-end">
			<div className="flex justify-end w-full p-4 px-6 border-b border-white border-opacity-20">
				<div className="flex items-center">
					<button
						onClick={() => action()}
						className="inline-flex items-center justify-center select-none relative whitespace-nowrap leading-snug rounded-lg font-semibold h-10 min-w-[120px] text-sm py-3 px-3 border border-opacity-20 border-white text-white ml-4 font-inter transition-all hover:bg-white hover:text-black"
					>
						{buttonText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ActionHeader;
