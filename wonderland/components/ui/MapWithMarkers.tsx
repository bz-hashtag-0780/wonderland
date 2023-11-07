/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const MapWithMarkers = ({ setModalOpen }: any) => {
	const mapRef = useRef(null);

	useEffect(() => {
		const draggable = Draggable.create(mapRef.current, {
			type: 'x,y',
			bounds: '#container',
			onDrag: function () {
				// Custom logic for dragging
			},
		});

		return () => {
			if (draggable[0]) {
				draggable[0].kill();
			}
		};
	}, []);

	const handlePinClick = () => {
		console.log('Pin clicked!');
		// Additional logic for pin click
		setModalOpen(true);
	};

	return (
		<div
			id="container"
			className="relative w-screen h-screen overflow-hidden"
		>
			<div ref={mapRef} className="w-full scale-150 transform">
				<img
					src="/images/wonderland/wonderland-map.png"
					alt="Custom Map"
					className="w-full h-auto"
				/>
				<div
					onClick={handlePinClick}
					style={{
						position: 'absolute',
						top: '650px', // Adjust to position the pin
						left: '480px', // Adjust to position the pin
						transform: 'translate(-50%, -100%)',
						cursor: 'pointer',
						// Add more styles for your pin here
					}}
				>
					{/* Pin Icon/Text */}
					Pin
				</div>
			</div>
		</div>
	);
};

export default MapWithMarkers;
