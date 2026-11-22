import { useState } from "react";
import type { Camp } from "~/lib/types";
import { CATEGORY_LABELS } from "~/lib/types";

interface CampCardProps {
	camp: Camp;
	isSelected: boolean;
	isHovered: boolean;
	onClick: () => void;
	onMouseEnter: () => void;
	onMouseLeave: () => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
	general: { bg: "bg-blue-100", text: "text-blue-800" },
	"art-music": { bg: "bg-purple-100", text: "text-purple-800" },
	instructional: { bg: "bg-green-100", text: "text-green-800" },
	sports: { bg: "bg-amber-100", text: "text-amber-800" },
	"theatre-dance": { bg: "bg-pink-100", text: "text-pink-800" },
};

function formatDateRange(startDate: string, endDate: string): string {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const options: Intl.DateTimeFormatOptions = {
		month: "short",
		day: "numeric",
	};
	// If same date, just show one date
	if (startDate === endDate) {
		return start.toLocaleDateString("en-US", options);
	}
	return `${start.toLocaleDateString("en-US", options)} - ${end.toLocaleDateString("en-US", options)}`;
}

function formatDateRanges(
	dateRanges: Array<{ startDate: string; endDate: string }>,
): string {
	return dateRanges
		.map((r) => formatDateRange(r.startDate, r.endDate))
		.join("; ");
}

export function CampCard({
	camp,
	isSelected,
	isHovered,
	onClick,
	onMouseEnter,
	onMouseLeave,
}: CampCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const categoryColors =
		CATEGORY_COLORS[camp.category] || CATEGORY_COLORS.general;
	const features: string[] = [
		camp.hasAftercare ? "Aftercare" : null,
		camp.hasOvernight ? "Overnight" : null,
		camp.hasScholarships ? "Scholarships" : null,
		camp.hasSpecialNeeds ? "Special Needs" : null,
	].filter((f): f is string => f !== null);

	return (
		<article
			className={`p-4 border rounded-lg cursor-pointer transition-all duration-150 ${
				isSelected
					? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
					: isHovered
						? "border-gray-400 bg-gray-50"
						: "border-gray-200 bg-white hover:border-gray-300"
			}`}
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onKeyDown={(e) => e.key === "Enter" && onClick()}
		>
			<div className="flex items-start justify-between gap-2 mb-2">
				<h3 className="font-semibold text-gray-900 leading-tight">
					{camp.name}
				</h3>
				<span
					className={`shrink-0 px-2 py-0.5 text-xs rounded ${categoryColors.bg} ${categoryColors.text}`}
				>
					{CATEGORY_LABELS[camp.category]}
				</span>
			</div>

			<div className="mb-3">
				<p
					className={`text-sm text-gray-600 ${isExpanded ? "" : "line-clamp-2"}`}
				>
					{camp.description}
				</p>
				<button
					type="button"
					className="text-xs text-blue-600 hover:text-blue-800 mt-1"
					onClick={(e) => {
						e.stopPropagation();
						setIsExpanded(!isExpanded);
					}}
				>
					{isExpanded ? "Show less" : "Read more"}
				</button>
			</div>

			<div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-500 mb-3">
				<div className="flex items-center gap-1">
					<svg
						className="w-4 h-4 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Calendar icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
					{formatDateRanges(camp.dateRanges)}
				</div>
				<div className="flex items-center gap-1">
					<svg
						className="w-4 h-4 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Age icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
					Ages {camp.ageMin}-{camp.ageMax}
				</div>
				{camp.startTime && camp.endTime && (
					<div className="flex items-center gap-1">
						<svg
							className="w-4 h-4 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Time icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						{camp.startTime} - {camp.endTime}
					</div>
				)}
				<div className="flex items-center gap-1">
					<svg
						className="w-4 h-4 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Price icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					{camp.priceMin === camp.priceMax
						? `$${camp.priceMin}`
						: `$${camp.priceMin}-$${camp.priceMax}`}
				</div>
			</div>

			{features.length > 0 && (
				<div className="flex flex-wrap gap-1 mb-3">
					{features.map((feature) => (
						<span
							key={feature}
							className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
						>
							{feature}
						</span>
					))}
				</div>
			)}

			{camp.locations.length > 0 && camp.locations[0].address && (
				<p className="text-xs text-gray-500 mb-2">
					{camp.locations.length === 1
						? camp.locations[0].address
						: `${camp.locations.length} locations`}
				</p>
			)}

			<a
				href={camp.website}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline"
				onClick={(e) => e.stopPropagation()}
			>
				Visit website
				<svg
					className="w-3 h-3"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>External link icon</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
					/>
				</svg>
			</a>
		</article>
	);
}
