'use client';

import React, { useState, useEffect } from 'react';

const MusicToggle = ({ audioUrl }: any) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [audio, setAudio] = useState<any>(null);

	useEffect(() => {
		const audioInstance = new Audio(audioUrl);
		setAudio(audioInstance);
	}, [audioUrl]);

	useEffect(() => {
		if (audio) {
			isPlaying ? audio.play() : audio.pause();
		}
	}, [isPlaying, audio]);

	useEffect(() => {
		return () => {
			if (audio) {
				audio.pause();
			}
		};
	}, [audio]);

	const togglePlay = () => {
		setIsPlaying(!isPlaying);
	};

	return (
		<div className="absolute bottom-5 left-5 m-4 z-10">
			<button onClick={togglePlay} className="">
				<svg
					width="60"
					height="60"
					viewBox="0 0 44 44"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M6.82633 6.82633L22 0.541196L37.1737 6.82633L43.4588 22L37.1737 37.1737L22 43.4588L6.82633 37.1737L0.541196 22L6.82633 6.82633Z"
						stroke="white"
						strokeOpacity="1"
						fill="white"
						fillOpacity="0.2"
					></path>
					<path
						d="M15 20V24.5H17.5L21.5 27.5V17L17.5 20H15Z"
						stroke="white"
						strokeLinecap="square"
					></path>
					{isPlaying ? (
						<path
							id="play"
							d="M24 20.5C24 20.5 25 21 25 22.25C25 23.5 24 24 24 24M25 17.5C27 18.5 28 20 28 22.25C28 24.5 27 26 25 27"
							stroke="white"
							strokeLinecap="square"
						></path>
					) : (
						<path
							id="mute"
							d="M27.5 20L24 24.5M24 20L27.5 24.5"
							stroke="white"
							strokeLinecap="square"
						></path>
					)}
				</svg>
			</button>
		</div>
	);
};

export default MusicToggle;
