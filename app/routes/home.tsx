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
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowList(!showList)}
              className="md:hidden px-3 py-1.5 text-sm bg-gray-100 rounded-md"
            >
              {showList ? "Show Map" : "Show List"}
            </button>
            <a
              href="https://github.com/kayluhb/austin-summer-camps"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="View source on GitHub"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-6"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </div>
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
