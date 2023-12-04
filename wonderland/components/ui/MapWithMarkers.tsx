/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

const MapWithMarkers = ({ setModalOpen, setFlovatarOpen }: any) => {
	const mapRef = useRef<any>(null);
	const [pinPositions, setPinPositions] = useState([
		{ x: 0, y: 0, image: '/images/basicBeasts/bb_thumbnail.png' }, // Initial positions for pin 1
		{ x: 0, y: 0, image: '/images/inception_animals/ia_thumbnail.png' }, // Initial positions for pin 2
		{ x: 0, y: 0, image: '/images/flovatar/flovatar_thumbnail.png' }, // Initial positions for pin 3
	]);

	useLayoutEffect(() => {
		const updatePinPositions = () => {
			const mapBounds = mapRef.current.getBoundingClientRect();
			// Adjust these percentages for each pin's position relative to the map image
			setPinPositions([
				{
					x: mapBounds.width * 0.15,
					y: mapBounds.height * 0.33,
					image: '/images/basicBeasts/bb_thumbnail.png',
				}, // Pin 1 position
				{
					x: mapBounds.width * 0.48,
					y: mapBounds.height * 0.35,
					image: '/images/inception_animals/ia_thumbnail.png',
				}, // Pin 2 position
				{
					x: mapBounds.width * 0.32,
					y: mapBounds.height * 0.15,
					image: '/images/flovatar/flovatar_thumbnail.png',
				}, // Pin 3 position
			]);
		};

		setTimeout(updatePinPositions, 200);
		window.addEventListener('resize', updatePinPositions);

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
			window.removeEventListener('resize', updatePinPositions);
		};
	}, []);

	const handlePinClick = (pinIndex: any) => {
		console.log(`Pin ${pinIndex} clicked!`);
		if (pinIndex === 0) {
			setModalOpen(true);
		}
		// You can add different logic for each pin based on the pinIndex
		if (pinIndex === 2) {
			setFlovatarOpen(true);
		}
	};

	return (
		<div
			id="container"
			className="relative w-screen h-screen overflow-hidden"
		>
			{' '}
			<div ref={mapRef} className="w-full scale-150 transform">
				<img
					src="/images/wonderland/cloud.png"
					alt="Moving Cloud 1"
					className="absolute cloud-animation" // Use the same class for animation
					style={{ top: '10%', left: '-200%' }} // Start off-screen (left)
				/>
				<img
					src="/images/wonderland/cloud.png"
					alt="Moving Cloud 2"
					className="absolute cloud-animation"
					style={{ top: '10%', left: '0' }} // Start on-screen
				/>
				<img
					src="/images/wonderland/wonderland-map.png"
					alt="Custom Map"
					className="w-full h-auto"
				/>
				{pinPositions.map((position, index) => (
					<div
						key={index}
						onClick={() => handlePinClick(index)}
						style={{
							position: 'absolute',
							top: position.y,
							left: position.x,
							transform: 'translate(-50%, -100%)',
							cursor: 'pointer',
						}}
						className="pin"
					>
						<img
							src={position.image}
							alt={`Pin ${index}`}
							className="pinImage"
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default MapWithMarkers;
