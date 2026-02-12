export type CampCategory =
	| "general"
	| "art-music"
	| "instructional"
	| "sports"
	| "theatre-dance";

export interface CampLocation {
	address: string;
	lat: number;
	lng: number;
}

export interface DateRange {
	startDate: string; // ISO date
	endDate: string;
}

export interface Camp {
	id: string;
	name: string;
	description: string;
	category: CampCategory;
	locations: CampLocation[];
	startDate: string; // ISO date - earliest across all ranges (for filtering)
	endDate: string; // latest across all ranges (for filtering)
	dateRanges: DateRange[]; // individual date ranges for display
	startTime?: string; // "9:00 AM"
	endTime?: string;
	ageMin: number;
	ageMax: number;
	priceMin: number;
	priceMax: number;
	hasAftercare: boolean;
	hasOvernight: boolean;
	hasScholarships: boolean;
	hasSpecialNeeds: boolean;
	website: string;
}

export interface Filters {
	dateStart?: string;
	dateEnd?: string;
	timeStart?: string;
	timeEnd?: string;
	age?: number;
	categories: CampCategory[];
	priceMin?: number;
	priceMax?: number;
	hasAftercare?: boolean;
	hasOvernight?: boolean;
	hasScholarships?: boolean;
	hasSpecialNeeds?: boolean;
}

export const CATEGORY_LABELS: Record<CampCategory, string> = {
	general: "General",
	"art-music": "Art & Music",
	instructional: "Instructional",
	sports: "Sports",
	"theatre-dance": "Theatre & Dance",
};

export const ALL_CATEGORIES: CampCategory[] = [
	"general",
	"art-music",
	"instructional",
	"sports",
	"theatre-dance",
];
