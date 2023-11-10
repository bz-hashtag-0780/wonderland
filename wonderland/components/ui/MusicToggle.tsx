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
		<button
			onClick={togglePlay}
			className="absolute bottom-100 left-0 m-4 z-10"
		>
			{isPlaying ? 'Stop Music' : 'Play Music'}
		</button>
	);
};

export default MusicToggle;
