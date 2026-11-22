import { useCallback, useEffect, useRef, useState } from "react";
import MapGL, { type MapRef, Marker } from "react-map-gl/mapbox";
import type { Camp } from "~/lib/types";
import { CampPopup } from "./CampPopup";

import "mapbox-gl/dist/mapbox-gl.css";

interface CampMapProps {
	camps: Camp[];
	selectedCampId: string | null;
	hoveredCampId: string | null;
	onSelectCamp: (id: string | null) => void;
	onHoverCamp: (id: string | null) => void;
	mapboxToken: string;
}

const AUSTIN_CENTER = {
	latitude: 30.2672,
	longitude: -97.7431,
	zoom: 10,
};

const CATEGORY_COLORS: Record<string, string> = {
	general: "#3B82F6", // blue
	"art-music": "#8B5CF6", // purple
	instructional: "#10B981", // green
	sports: "#F59E0B", // amber
	"theatre-dance": "#EC4899", // pink
};

export function CampMap({
	camps,
	selectedCampId,
	hoveredCampId,
	onSelectCamp,
	onHoverCamp,
	mapboxToken,
}: CampMapProps) {
	const mapRef = useRef<MapRef>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [popupCamp, setPopupCamp] = useState<Camp | null>(null);
	const [popupLocationIndex, setPopupLocationIndex] = useState(0);
	const handledByMarkerClick = useRef(false);

	// Resize map canvas when container size changes (e.g. toggling from hidden to visible on mobile)
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const observer = new ResizeObserver(() => {
			mapRef.current?.resize();
		});
		observer.observe(container);
		return () => observer.disconnect();
	}, []);

	// Pan to selected camp when selected from the list
	useEffect(() => {
		if (handledByMarkerClick.current) {
			handledByMarkerClick.current = false;
			return;
		}
		if (selectedCampId && mapRef.current) {
			const camp = camps.find((c) => c.id === selectedCampId);
			if (camp && camp.locations.length > 0) {
				if (camp.locations.length === 1) {
					const location = camp.locations[0];
					mapRef.current.flyTo({
						center: [location.lng, location.lat],
						zoom: 13,
						duration: 1000,
					});
				} else {
					// Multiple locations — fit bounds to show all
					const lngs = camp.locations.map((l) => l.lng);
					const lats = camp.locations.map((l) => l.lat);
					mapRef.current.fitBounds(
						[
							[Math.min(...lngs), Math.min(...lats)],
							[Math.max(...lngs), Math.max(...lats)],
						],
						{
							padding: 100,
							duration: 1000,
							maxZoom: 13,
						},
					);
				}
				setPopupCamp(null);
			}
		}
	}, [selectedCampId, camps]);

	const handleMarkerClick = useCallback(
		(camp: Camp, locationIndex: number) => {
			handledByMarkerClick.current = true;
			onSelectCamp(camp.id);
			setPopupCamp(camp);
			setPopupLocationIndex(locationIndex);

			// Fly to the specific clicked location
			if (mapRef.current) {
				const location = camp.locations[locationIndex];
				mapRef.current.flyTo({
					center: [location.lng, location.lat],
					zoom: 13,
					duration: 1000,
				});
			}
		},
		[onSelectCamp],
	);

	const handlePopupClose = useCallback(() => {
		setPopupCamp(null);
		setPopupLocationIndex(0);
		onSelectCamp(null);
	}, [onSelectCamp]);

	return (
		<div ref={containerRef} style={{ position: "absolute", inset: 0 }}>
			<MapGL
				ref={mapRef}
				mapboxAccessToken={mapboxToken}
				initialViewState={AUSTIN_CENTER}
				style={{ width: "100%", height: "100%" }}
				mapStyle="mapbox://styles/mapbox/streets-v12"
			>
				{camps.flatMap((camp) => {
					const isSelected = camp.id === selectedCampId;
					const isHovered = camp.id === hoveredCampId;
					const color = CATEGORY_COLORS[camp.category] || "#3B82F6";

					// Render a marker for each location
					return camp.locations.map((location, locationIndex) => (
						<Marker
							key={`${camp.id}-${location.lat}-${location.lng}`}
							longitude={location.lng}
							latitude={location.lat}
							anchor="bottom"
							onClick={(e) => {
								e.originalEvent.stopPropagation();
								handleMarkerClick(camp, locationIndex);
							}}
						>
							<button
								type="button"
								className="cursor-pointer transition-transform duration-150"
								style={{
									transform:
										isSelected || isHovered ? "scale(1.3)" : "scale(1)",
								}}
								onMouseEnter={() => onHoverCamp(camp.id)}
								onMouseLeave={() => onHoverCamp(null)}
								aria-label={`View ${camp.name}${camp.locations.length > 1 ? ` - ${location.address}` : ""}`}
							>
								<svg
									width="24"
									height="32"
									viewBox="0 0 24 32"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>Camp marker</title>
									<path
										d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z"
										fill={color}
										stroke={isSelected || isHovered ? "#1F2937" : "white"}
										strokeWidth="2"
									/>
									<circle cx="12" cy="12" r="5" fill="white" />
								</svg>
							</button>
						</Marker>
					));
				})}

				{popupCamp && (
					<CampPopup
						camp={popupCamp}
						locationIndex={popupLocationIndex}
						onClose={handlePopupClose}
					/>
				)}
			</MapGL>
		</div>
	);
}
