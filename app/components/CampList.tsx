import { useEffect, useRef } from "react";
import type { Camp } from "~/lib/types";
import { CampCard } from "./CampCard";

interface CampListProps {
	camps: Camp[];
	selectedCampId: string | null;
	hoveredCampId: string | null;
	onSelectCamp: (id: string | null) => void;
	onHoverCamp: (id: string | null) => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
}

export function CampList({
	camps,
	selectedCampId,
	hoveredCampId,
	onSelectCamp,
	onHoverCamp,
	searchQuery,
	onSearchChange,
}: CampListProps) {
	const listRef = useRef<HTMLDivElement>(null);
	const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	// Scroll to selected camp when selection changes (from map click)
	useEffect(() => {
		if (selectedCampId) {
			const cardElement = cardRefs.current.get(selectedCampId);
			if (cardElement && listRef.current) {
				cardElement.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
				});
			}
		}
	}, [selectedCampId]);

	return (
		<div ref={listRef} className="h-full overflow-y-auto p-4">
			<search className="relative mb-3">
				<svg
					className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
					aria-hidden="true"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					type="search"
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Search camps..."
					aria-label="Search camps"
					className="w-full border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
				/>
				{searchQuery && (
					<button
						type="button"
						onClick={() => onSearchChange("")}
						aria-label="Clear search"
						className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
					>
						<svg
							className="w-4 h-4"
							aria-hidden="true"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				)}
			</search>
			<div className="text-sm text-gray-500 mb-4" aria-live="polite">
				{camps.length} camp{camps.length !== 1 ? "s" : ""} found
			</div>
			{camps.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<svg
						className="w-16 h-16 text-gray-300 mb-4"
						aria-hidden="true"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.5}
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h3 className="text-lg font-medium text-gray-900 mb-1">
						No camps found
					</h3>
					<p className="text-sm text-gray-500">
						Try adjusting your filters to see more results.
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{camps.map((camp) => (
						<div
							key={camp.id}
							ref={(el) => {
								if (el) cardRefs.current.set(camp.id, el);
								else cardRefs.current.delete(camp.id);
							}}
						>
							<CampCard
								camp={camp}
								isSelected={camp.id === selectedCampId}
								isHovered={camp.id === hoveredCampId}
								onClick={() =>
									onSelectCamp(camp.id === selectedCampId ? null : camp.id)
								}
								onMouseEnter={() => onHoverCamp(camp.id)}
								onMouseLeave={() => onHoverCamp(null)}
							/>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
