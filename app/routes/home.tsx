import { useCallback, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { CampList } from "~/components/CampList";
import { CampMap } from "~/components/CampMap";
import { FilterPanel } from "~/components/FilterPanel";
import campsData from "~/data/camps.json";
import {
  filterCamps,
  filtersToSearchParams,
  searchParamsToFilters,
} from "~/lib/filter";
import type { Camp, Filters } from "~/lib/types";
import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Austin Summer Camps Map" },
    {
      name: "description",
      content: "Browse and filter Austin summer camps on an interactive map",
    },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  const mapboxToken = (context.cloudflare.env as { MAPBOX_TOKEN?: string })
    .MAPBOX_TOKEN;
  if (!mapboxToken) {
    throw new Error("MAPBOX_TOKEN environment variable is not set");
  }
  return { mapboxToken };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { mapboxToken } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCampId, setSelectedCampId] = useState<string | null>(null);
  const [hoveredCampId, setHoveredCampId] = useState<string | null>(null);
  const [showList, setShowList] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const camps = campsData as Camp[];

  const urlFilters = useMemo(
    () => searchParamsToFilters(searchParams),
    [searchParams],
  );

  // Local filter state for immediate UI updates (debounced sync to URL)
  const [localFilters, setLocalFilters] = useState<Filters | null>(null);
  const filters = localFilters ?? urlFilters;

  const filteredCamps = useMemo(() => {
    let result = filterCamps(camps, filters);
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (camp) =>
          camp.name.toLowerCase().includes(query) ||
          camp.description.toLowerCase().includes(query),
      );
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [filters, searchQuery]);

  const priceRange = useMemo(() => {
    const prices = camps.flatMap((c) => [c.priceMin, c.priceMax]);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, []);

  // Debounce URL updates to prevent rapid-fire requests (e.g., from slider dragging)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleFiltersChange = useCallback(
    (newFilters: Filters) => {
      // Update local state immediately for responsive UI
      setLocalFilters(newFilters);

      // Debounce the URL update
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        setSearchParams(filtersToSearchParams(newFilters), { replace: true });
        setLocalFilters(null); // Clear local override, URL is now source of truth
      }, 150);
    },
    [setSearchParams],
  );

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Austin Summer Camps
            </h1>
            <span className="text-xs text-gray-500">
              Data from{" "}
              <a
                href="https://www.austinchronicle.com/summer-camps/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Austin Chronicle
              </a>{" "}
              and augmented from /r/austin subreddit users.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowList(!showList)}
            className="md:hidden px-3 py-1.5 text-sm bg-gray-100 rounded-md"
          >
            {showList ? "Show Map" : "Show List"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - List & Filters */}
        <aside
          className={`w-full md:w-96 flex flex-col border-r border-gray-200 bg-white shrink-0 ${
            showList ? "flex" : "hidden md:flex"
          }`}
        >
          <FilterPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            priceRange={priceRange}
          />
          <div className="flex-1 overflow-hidden">
            <CampList
              camps={filteredCamps}
              selectedCampId={selectedCampId}
              hoveredCampId={hoveredCampId}
              onSelectCamp={setSelectedCampId}
              onHoverCamp={setHoveredCampId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </aside>

        {/* Right Panel - Map */}
        <main
          className={`flex-1 relative ${!showList ? "block" : "hidden md:block"}`}
        >
          <CampMap
            camps={filteredCamps}
            selectedCampId={selectedCampId}
            hoveredCampId={hoveredCampId}
            onSelectCamp={setSelectedCampId}
            onHoverCamp={setHoveredCampId}
            mapboxToken={mapboxToken}
          />
        </main>
      </div>
    </div>
  );
}
