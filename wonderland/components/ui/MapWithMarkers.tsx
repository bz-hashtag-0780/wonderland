/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const MapWithMarkers = ({ setModalOpen }: any) => {
	const mapRef = useRef<any>(null);
	const [pinPosition, setPinPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const updatePinPosition = () => {
			const mapBounds = mapRef.current.getBoundingClientRect();
			// Adjust these percentages to set the pin's position relative to the map image
			const pinXPercent = 0.16; // Example: 40% of the image width
			const pinYPercent = 0.36; // Example: 50% of the image height

			setPinPosition({
				x: mapBounds.width * pinXPercent,
				y: mapBounds.height * pinYPercent,
			});
		};

		updatePinPosition();
		// Update pin position on window resize
		window.addEventListener('resize', updatePinPosition);

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
			window.removeEventListener('resize', updatePinPosition);
		};
	}, []);

	const handlePinClick = () => {
		console.log('Pin clicked!');
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
						top: pinPosition.y,
						left: pinPosition.x,
						transform: 'translate(-50%, -100%)',
						cursor: 'pointer',
					}}
					className="pin"
				>
					<img
						src="/images/basicBeasts/bb_thumbnail.png"
						alt="Noodles"
						className="pinImage"
					/>
				</div>
			</div>
		</div>
	);
};

export default MapWithMarkers;
