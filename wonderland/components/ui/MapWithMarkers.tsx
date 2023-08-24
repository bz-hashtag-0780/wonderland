'use client';

// components/MapWithMarkers.js
import React from 'react';

const markers = [
	{ id: 1, left: '10%', top: '20%' },
	{ id: 2, left: '40%', top: '30%' },
	// ... add all 10 markers with their relative positions
];

const MapWithMarkers = () => {
	return (
		<div className="relative w-full max-w-xl mx-auto">
			<img
				src="/images/placeholders/placeholder-map.jpg"
				alt="Custom Map"
				className="w-full"
			/>
			{markers.map((marker) => (
				<div
					key={marker.id}
					className="absolute w-6 h-6 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
					style={{ left: marker.left, top: marker.top }}
					onClick={() => alert(`Marker ${marker.id} clicked!`)}
				></div>
			))}
		</div>
	);
};

export default MapWithMarkers;
