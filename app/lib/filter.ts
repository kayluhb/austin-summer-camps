import type { Camp, Filters } from "./types";

function parseTimeToMinutes(time: string): number {
	const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
	if (!match) return 0;
	let hours = Number.parseInt(match[1], 10);
	const minutes = Number.parseInt(match[2], 10);
	const period = match[3].toUpperCase();
	if (period === "PM" && hours !== 12) hours += 12;
	if (period === "AM" && hours === 12) hours = 0;
	return hours * 60 + minutes;
}

export function filterCamps(camps: Camp[], filters: Filters): Camp[] {
	return camps.filter((camp) => {
		// Date range filter: camp must overlap with selected date range
		if (filters.dateStart || filters.dateEnd) {
			const campStart = new Date(camp.startDate);
			const campEnd = new Date(camp.endDate);
			const filterStart = filters.dateStart
				? new Date(filters.dateStart)
				: null;
			const filterEnd = filters.dateEnd ? new Date(filters.dateEnd) : null;

			// Camp must overlap with filter range
			if (filterStart && campEnd < filterStart) return false;
			if (filterEnd && campStart > filterEnd) return false;
		}

		// Time filter: "starts before X" means camp must start at or before X
		if (filters.timeStart && camp.startTime) {
			const filterStartMinutes = parseTimeToMinutes(filters.timeStart);
			const campStartMinutes = parseTimeToMinutes(camp.startTime);
			if (campStartMinutes > filterStartMinutes) return false;
		}

		// Time filter: "ends after X" means camp must end at or after X
		if (filters.timeEnd && camp.endTime) {
			const filterEndMinutes = parseTimeToMinutes(filters.timeEnd);
			const campEndMinutes = parseTimeToMinutes(camp.endTime);
			if (campEndMinutes < filterEndMinutes) return false;
		}

		// Age filter: child's age must be within camp's range
		if (filters.age !== undefined) {
			if (filters.age < camp.ageMin || filters.age > camp.ageMax) return false;
		}

		// Category filter
		if (filters.categories.length > 0) {
			if (!filters.categories.includes(camp.category)) return false;
		}

		// Price filter
		if (filters.priceMin !== undefined) {
			if (camp.priceMax < filters.priceMin) return false;
		}
		if (filters.priceMax !== undefined) {
			if (camp.priceMin > filters.priceMax) return false;
		}

		// Feature filters
		if (filters.hasAftercare && !camp.hasAftercare) return false;
		if (filters.hasOvernight && !camp.hasOvernight) return false;
		if (filters.hasScholarships && !camp.hasScholarships) return false;
		if (filters.hasSpecialNeeds && !camp.hasSpecialNeeds) return false;

		return true;
	});
}

export function filtersToSearchParams(filters: Filters): URLSearchParams {
	const params = new URLSearchParams();

	if (filters.dateStart) params.set("dateStart", filters.dateStart);
	if (filters.dateEnd) params.set("dateEnd", filters.dateEnd);
	if (filters.timeStart) params.set("timeStart", filters.timeStart);
	if (filters.timeEnd) params.set("timeEnd", filters.timeEnd);
	if (filters.age !== undefined) params.set("age", String(filters.age));
	if (filters.categories.length > 0) {
		params.set("categories", filters.categories.join(","));
	}
	if (filters.priceMin !== undefined)
		params.set("priceMin", String(filters.priceMin));
	if (filters.priceMax !== undefined)
		params.set("priceMax", String(filters.priceMax));
	if (filters.hasAftercare) params.set("aftercare", "true");
	if (filters.hasOvernight) params.set("overnight", "true");
	if (filters.hasScholarships) params.set("scholarships", "true");
	if (filters.hasSpecialNeeds) params.set("specialNeeds", "true");

	return params;
}

export function searchParamsToFilters(params: URLSearchParams): Filters {
	const categories = params.get("categories");
	return {
		dateStart: params.get("dateStart") || undefined,
		dateEnd: params.get("dateEnd") || undefined,
		timeStart: params.get("timeStart") || undefined,
		timeEnd: params.get("timeEnd") || undefined,
		age: params.has("age") ? Number(params.get("age")) : undefined,
		categories: categories
			? (categories.split(",") as Filters["categories"])
			: [],
		priceMin: params.has("priceMin")
			? Number(params.get("priceMin"))
			: undefined,
		priceMax: params.has("priceMax")
			? Number(params.get("priceMax"))
			: undefined,
		hasAftercare: params.get("aftercare") === "true",
		hasOvernight: params.get("overnight") === "true",
		hasScholarships: params.get("scholarships") === "true",
		hasSpecialNeeds: params.get("specialNeeds") === "true",
	};
}
