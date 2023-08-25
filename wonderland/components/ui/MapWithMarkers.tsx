'use client';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const MapWithMarkers = () => {
	const mapRef = useRef(null);

	useEffect(() => {
		const draggable = Draggable.create(mapRef.current, {
			type: 'x,y',
			bounds: '#container',
			onDrag: function () {
				// Custom logic to check bounds and adjust position
				// If the image is reaching one edge, adjust its position to the other edge
			},
		});

		return () => {
			// Clean up on component unmount
			draggable.kill();
		};
	}, []);

	return (
		<div
			id="container"
			className="relative w-screen h-screen overflow-hidden"
		>
			<img
				ref={mapRef}
				src="/images/placeholders/placeholder-map.jpg"
				alt="Custom Map"
				className="w-full h-full scale-150 transform"
			/>
		</div>
	);
};

export default MapWithMarkers;
