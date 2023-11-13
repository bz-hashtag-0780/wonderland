import React from 'react';

const Project: React.FC<any> = ({ projectName, setModalOpen }) => {
	return (
		<button
			id="icon-button"
			className="flex-auto justify-center items-center flex flex-col align-stretch px-3 py-3 border-0 bg-transparent text-white min-w-[100px]"
			onClick={() => setModalOpen(true)}
		>
			<span id="icon-container" className="block h-10 w-10 mb-2">
				<span id="project-icon" className="top-0 left-0">
					<svg id="project-svg" viewBox="0 0 100 100">
						<path d="M73.11,38.74c-3.35-4.31-6-10-6-18.91,0-4.07-3.59-8.15-7.66-12-4.79-4.31-5.75-5.74-9.58-5.74h0c-3.83,0-4.79,1.43-9.34,5.74-4.07,3.83-7.66,7.91-7.66,12,0,8.86-2.88,14.6-6,18.68L12.76,52.87,2.23,45.69V58.62S2.47,84,39.58,97.89c0,0-14.13-7.18-16.28-31.13-.24-1.67-.24-9.1-.24-10.29A119.77,119.77,0,0,0,36.71,74h0c-.72-1.2-1.44-2.64-2.16-3.83-5-10.54-4.07-18.2-1.67-23.47a22.77,22.77,0,0,1,7.42-8.86l9.58,9.58h0l9.58-9.58a22.77,22.77,0,0,1,7.42,8.86c2.4,5.27,3.59,12.93-1.43,23.23C64.73,71.31,64,72.51,63.29,74h0A119.77,119.77,0,0,0,76.94,56.47c0,1.19,0,8.62-.24,10.29C74.31,90.71,60.42,97.89,60.42,97.89,97.53,84,97.77,58.62,97.77,58.62V45.69L87.24,52.87Z"></path>
					</svg>
				</span>
			</span>
			<span id="project-name" className="font-bold text-sm">
				{projectName}
			</span>
		</button>
	);
};

const ProjectNavigation = ({ setModalOpen }: any) => {
	return (
		<nav className="absolute bottom-0 right-0 m-4">
			<div className="flex relative  min-h-[100px]">
				<div id="list" className="flex relative gap-2 min-h-[100px]">
					<Project projectName="BEASTZ" setModalOpen={setModalOpen} />
					<Project
						projectName="FLOVATAR"
						setModalOpen={setModalOpen}
					/>
					<Project
						projectName="INCEPTION"
						setModalOpen={setModalOpen}
					/>
				</div>
			</div>
		</nav>
	);
};

export default ProjectNavigation;
