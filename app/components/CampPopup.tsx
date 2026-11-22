import { Popup } from "react-map-gl/mapbox";
import type { Camp } from "~/lib/types";
import { CATEGORY_LABELS } from "~/lib/types";

interface CampPopupProps {
	camp: Camp;
	locationIndex?: number;
	onClose: () => void;
}

export function CampPopup({
	camp,
	locationIndex = 0,
	onClose,
}: CampPopupProps) {
	const location = camp.locations[locationIndex] || camp.locations[0];
	if (!location) return null;

	return (
		<Popup
			longitude={location.lng}
			latitude={location.lat}
			onClose={onClose}
			closeOnClick={false}
			anchor="bottom"
			offset={20}
			className="camp-popup"
		>
			<div className="p-2 max-w-xs">
				<h3 className="font-semibold text-gray-900 text-sm mb-1">
					{camp.name}
				</h3>
				<span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded mb-2">
					{CATEGORY_LABELS[camp.category]}
				</span>
				{location.address && (
					<p className="text-xs text-gray-500 mb-1">{location.address}</p>
				)}
				{camp.locations.length > 1 && (
					<p className="text-xs text-gray-400 mb-1">
						+{camp.locations.length - 1} other location
						{camp.locations.length > 2 ? "s" : ""}
					</p>
				)}
				<p className="text-xs text-gray-600 mb-2 line-clamp-2">
					{camp.description}
				</p>
				<div className="text-xs text-gray-500 space-y-1">
					<div>
						Ages {camp.ageMin}-{camp.ageMax}
					</div>
					<div>
						{camp.priceMin === camp.priceMax
							? `$${camp.priceMin}`
							: `$${camp.priceMin}-$${camp.priceMax}`}
					</div>
				</div>
				<a
					href={camp.website}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-block mt-2 text-xs text-blue-600 hover:underline"
				>
					Visit website
				</a>
			</div>
		</Popup>
	);
}
