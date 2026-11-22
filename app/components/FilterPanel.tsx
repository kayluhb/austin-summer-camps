import { useState } from "react";
import type { CampCategory, Filters } from "~/lib/types";
import { ALL_CATEGORIES, CATEGORY_LABELS } from "~/lib/types";

interface FilterPanelProps {
	filters: Filters;
	onFiltersChange: (filters: Filters) => void;
	priceRange: { min: number; max: number };
}

export function FilterPanel({
	filters,
	onFiltersChange,
	priceRange,
}: FilterPanelProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) => {
		onFiltersChange({ ...filters, [key]: value });
	};

	const toggleCategory = (category: CampCategory) => {
		const newCategories = filters.categories.includes(category)
			? filters.categories.filter((c) => c !== category)
			: [...filters.categories, category];
		updateFilter("categories", newCategories);
	};

	const clearFilters = () => {
		onFiltersChange({
			categories: [],
			dateStart: undefined,
			dateEnd: undefined,
			timeStart: undefined,
			timeEnd: undefined,
			age: undefined,
			priceMin: undefined,
			priceMax: undefined,
			hasAftercare: undefined,
			hasOvernight: undefined,
			hasScholarships: undefined,
			hasSpecialNeeds: undefined,
		});
	};

	const hasActiveFilters =
		filters.categories.length > 0 ||
		filters.dateStart ||
		filters.dateEnd ||
		filters.timeStart ||
		filters.timeEnd ||
		filters.age !== undefined ||
		filters.priceMin !== undefined ||
		filters.priceMax !== undefined ||
		filters.hasAftercare ||
		filters.hasOvernight ||
		filters.hasScholarships ||
		filters.hasSpecialNeeds;

	return (
		<div className="bg-white border-b border-gray-200">
			<button
				type="button"
				onClick={() => setIsExpanded(!isExpanded)}
				className="w-full px-4 py-3 flex items-center justify-between text-left"
			>
				<div className="flex items-center gap-2">
					<svg
						className="w-5 h-5 text-gray-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>Filter icon</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
						/>
					</svg>
					<span className="font-medium text-gray-900">Filters</span>
					{hasActiveFilters && (
						<span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
							Active
						</span>
					)}
				</div>
				<svg
					className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>Expand/collapse icon</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			{isExpanded && (
				<div className="px-4 pb-4 space-y-4">
					{/* Date Range */}
					<div>
						<span className="block text-sm font-medium text-gray-700 mb-1">
							Date Range
						</span>
						<div className="grid grid-cols-2 gap-2">
							<input
								type="date"
								value={filters.dateStart || ""}
								onChange={(e) =>
									updateFilter("dateStart", e.target.value || undefined)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
								placeholder="Start date"
							/>
							<input
								type="date"
								value={filters.dateEnd || ""}
								onChange={(e) =>
									updateFilter("dateEnd", e.target.value || undefined)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
								placeholder="End date"
							/>
						</div>
					</div>

					{/* Time Range */}
					<div>
						<span className="block text-sm font-medium text-gray-700 mb-1">
							Time
						</span>
						<div className="grid grid-cols-2 gap-2">
							<select
								value={filters.timeStart || ""}
								onChange={(e) =>
									updateFilter("timeStart", e.target.value || undefined)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Starts before...</option>
								<option value="10:00 AM">10:00 AM</option>
								<option value="9:00 AM">9:00 AM</option>
								<option value="8:00 AM">8:00 AM</option>
								<option value="7:00 AM">7:00 AM</option>
							</select>
							<select
								value={filters.timeEnd || ""}
								onChange={(e) =>
									updateFilter("timeEnd", e.target.value || undefined)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">Ends after...</option>
								<option value="3:00 PM">3:00 PM</option>
								<option value="4:00 PM">4:00 PM</option>
								<option value="5:00 PM">5:00 PM</option>
								<option value="6:00 PM">6:00 PM</option>
							</select>
						</div>
					</div>

					{/* Age */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							<span>
								My child is{" "}
								<span className="text-blue-600 font-semibold">
									{filters.age !== undefined
										? `${filters.age} years old`
										: "..."}
								</span>
							</span>
							<input
								type="range"
								min={3}
								max={18}
								value={filters.age ?? 10}
								onChange={(e) => updateFilter("age", Number(e.target.value))}
								className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-1"
							/>
						</label>
						<div className="flex justify-between text-xs text-gray-500 mt-1">
							<span>3</span>
							<span>18</span>
						</div>
						{filters.age !== undefined && (
							<button
								type="button"
								onClick={() => updateFilter("age", undefined)}
								className="text-xs text-blue-600 hover:underline mt-1"
							>
								Clear age filter
							</button>
						)}
					</div>

					{/* Categories */}
					<div>
						<span className="block text-sm font-medium text-gray-700 mb-2">
							Categories
						</span>
						<div className="flex flex-wrap gap-2">
							{ALL_CATEGORIES.map((category) => (
								<button
									type="button"
									key={category}
									onClick={() => toggleCategory(category)}
									className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
										filters.categories.includes(category)
											? "bg-blue-100 border-blue-300 text-blue-800"
											: "bg-white border-gray-300 text-gray-700 hover:border-gray-400"
									}`}
								>
									{CATEGORY_LABELS[category]}
								</button>
							))}
						</div>
					</div>

					{/* Price Range */}
					<div>
						<span className="block text-sm font-medium text-gray-700 mb-1">
							Price Range
						</span>
						<div className="grid grid-cols-2 gap-2">
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
									$
								</span>
								<input
									type="number"
									value={filters.priceMin ?? ""}
									onChange={(e) =>
										updateFilter(
											"priceMin",
											e.target.value ? Number(e.target.value) : undefined,
										)
									}
									placeholder={String(priceRange.min)}
									className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
									$
								</span>
								<input
									type="number"
									value={filters.priceMax ?? ""}
									onChange={(e) =>
										updateFilter(
											"priceMax",
											e.target.value ? Number(e.target.value) : undefined,
										)
									}
									placeholder={String(priceRange.max)}
									className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</div>
					</div>

					{/* Features */}
					<div>
						<span className="block text-sm font-medium text-gray-700 mb-2">
							Features
						</span>
						<div className="space-y-2">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={filters.hasAftercare || false}
									onChange={(e) =>
										updateFilter("hasAftercare", e.target.checked || undefined)
									}
									className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<span className="text-sm text-gray-700">
									Aftercare available
								</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={filters.hasOvernight || false}
									onChange={(e) =>
										updateFilter("hasOvernight", e.target.checked || undefined)
									}
									className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<span className="text-sm text-gray-700">Overnight option</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={filters.hasScholarships || false}
									onChange={(e) =>
										updateFilter(
											"hasScholarships",
											e.target.checked || undefined,
										)
									}
									className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<span className="text-sm text-gray-700">
									Scholarships offered
								</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="checkbox"
									checked={filters.hasSpecialNeeds || false}
									onChange={(e) =>
										updateFilter(
											"hasSpecialNeeds",
											e.target.checked || undefined,
										)
									}
									className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
								/>
								<span className="text-sm text-gray-700">Special needs</span>
							</label>
						</div>
					</div>

					{/* Clear Filters */}
					{hasActiveFilters && (
						<button
							type="button"
							onClick={clearFilters}
							className="w-full py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
						>
							Clear all filters
						</button>
					)}
				</div>
			)}
		</div>
	);
}
