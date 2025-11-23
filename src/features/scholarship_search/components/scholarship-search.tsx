import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ArrowRight, GraduationCap, RefreshCw } from "lucide-react";
import {
  useCallback,
  useDeferredValue,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  useForceRecreateScholarshipRecommend,
  useRecommendScholarships,
  useSearchScholarships,
} from "../hooks/use-scholarship";
import type { SEARCH_KEYS } from "../utils/constants";
import type { FilterOption } from "../utils/types";
import MobileScholarshipFilter from "./mobile-scholarship-filter";
import ScholarshipFilter from "./scholarship-filter";
import ScholarshipPagination from "./scholarship-pagination";
import ScholarshipResults from "./scholarship-results";
import ScholarshipSearchInput from "./scholarship-search-input";

export const ScholarshipSearch = () => {
  const [currentSearchValue, setCurrentSearchValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { isAuthenticated } = useAuth();
  const [alertOpen, setAlertOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPendingTransition, startTransition] = useTransition();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const ITEMS_PER_PAGE = 20;
  const RECOMMENDATION_LIMIT = 50;

  const buildSearchQuery = useCallback(
    (textQuery: string, filters: FilterOption[]) => {
      const tq = textQuery.trim();
      if (!tq && filters.length === 0) return "";
      const base = tq;
      if (filters.length > 0) {
        const parts = filters.map((f) => `${f.key}:"${f.value}"`);
        return base ? `${base} ${parts.join(" ")}` : parts.join(" ");
      }
      return base;
    },
    []
  );

  // recommendations
  const {
    data: recommendedScholarships = [],
    isLoading: isLoadingRecommendations,
  } = useRecommendScholarships({
    suggest: true,
    limit: RECOMMENDATION_LIMIT,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  // search
  const { data: searchResults = [], isLoading: isSearching } =
    useSearchScholarships(searchQuery);

  const { mutate: forceRecreateRecommend, isPending } =
    useForceRecreateScholarshipRecommend();

  // pick list
  const scholarships = useMemo(
    () => (searchQuery ? searchResults : recommendedScholarships),
    [searchQuery, searchResults, recommendedScholarships]
  );
  const isLoading = useMemo(
    () => (searchQuery ? isSearching : isLoadingRecommendations),
    [searchQuery, isSearching, isLoadingRecommendations]
  );
  const totalPages = useMemo(
    () => Math.ceil(scholarships.length / ITEMS_PER_PAGE),
    [scholarships.length]
  );
  const hasSearchCriteria = useMemo(
    () => searchQuery.trim() !== "",
    [searchQuery]
  );

  // defer heavy rendering
  const deferredScholarships = useDeferredValue(scholarships);
  const deferredIsLoading = useDeferredValue(isLoading);

  const handleSearchChange = useCallback((value: string) => {
    startTransition(() => {
      setCurrentSearchValue(value);
    });
  }, []);

  const handleSearch = useCallback(() => {
    const q = buildSearchQuery(currentSearchValue, activeFilters);
    setSearchQuery(q);
    setCurrentPage(1);
  }, [currentSearchValue, activeFilters, buildSearchQuery]);

  const removeFilter = useCallback(
    (key: SEARCH_KEYS, value: string) => {
      setActiveFilters((prev) => {
        const next = prev.filter((f) => !(f.key === key && f.value === value));
        const hasText = currentSearchValue.trim() !== "";
        if (next.length > 0 || hasText) {
          startTransition(() => {
            setSearchQuery(buildSearchQuery(currentSearchValue, next));
            setCurrentPage(1);
          });
        } else {
          setSearchQuery("");
        }
        return next;
      });
    },
    [currentSearchValue, buildSearchQuery]
  );

  const clearAllFilters = useCallback(() => {
    setActiveFilters([]);
    if (!currentSearchValue.trim()) {
      setSearchQuery("");
    }
  }, [currentSearchValue]);

  const handlePageChange = useCallback((page: number) => {
    startTransition(() => {
      setCurrentPage(page);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRegenerate = useCallback(() => {
    setAlertOpen(false);
    setIsRegenerating(true);
    forceRecreateRecommend(undefined, {
      onSuccess: () => setIsRegenerating(false),
      onError: () => setIsRegenerating(false),
    });
  }, [forceRecreateRecommend]);

  const titleText = useMemo(() => {
    if (deferredIsLoading) return "Getting scholarship data...";
    if (hasSearchCriteria)
      return `${deferredScholarships.length} scholarships found`;
    return "Recommended scholarships for this week";
  }, [deferredIsLoading, hasSearchCriteria, deferredScholarships.length]);

  const resultsSection = useMemo(() => {
    return (
      <ScholarshipResults
        scholarships={deferredScholarships}
        isLoading={deferredIsLoading}
        title=""
      />
    );
  }, [deferredScholarships, deferredIsLoading]);

  const paginationSection = useMemo(() => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex justify-center mt-6">
        <ScholarshipPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    );
  }, [totalPages, currentPage, handlePageChange]);

  return (
    <div className="gap-6 grid grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] mx-auto w-full">
      {!isMobile && (
        <Card className="md:top-20 md:sticky border-muted-foreground/20 h-fit">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2 text-xl">
              <GraduationCap className="size-6" />
              Search for Scholarships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScholarshipFilter
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />
          </CardContent>
        </Card>
      )}
      <div className="flex flex-col gap-6 max-w-full">
        <div className="items-center gap-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] max-w-full">
          {isMobile && (
            <div className="flex justify-center items-center gap-2 w-full font-semibold text-muted-foreground text-xl">
              <GraduationCap className="size-5" />
              <p>Search for Scholarships</p>
            </div>
          )}
          <div className="w-full">
            <ScholarshipSearchInput
              value={currentSearchValue}
              setValue={handleSearchChange}
              activeFilters={activeFilters}
              removeFilter={removeFilter}
              clearAllFilters={clearAllFilters}
              isAuthenticated={isAuthenticated}
              onSearch={handleSearch}
            />
          </div>
          {isMobile && (
            <div className="z-10 relative w-full sm:w-auto">
              <MobileScholarshipFilter
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
              />
            </div>
          )}
        </div>

        <div className="flex sm:flex-row flex-col-reverse justify-between items-start sm:items-center gap-2 sm:gap-0">
          <h2 className="font-semibold text-primary text-2xl">{titleText}</h2>
          {!hasSearchCriteria && (
            <Button
              size="sm"
              onClick={() => setAlertOpen(true)}
              disabled={isRegenerating || isPending || isPendingTransition}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`size-4 ${
                  isRegenerating || isPending ? "animate-spin" : ""
                }`}
              />
              {isRegenerating || isPending
                ? "Regenerating..."
                : "Get New Recommendations"}
            </Button>
          )}
        </div>

        {resultsSection}

        <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Regenerate Recommendations</AlertDialogTitle>
              <AlertDialogDescription>
                This process will create new scholarship recommendations based
                on your profile. Please note that this may take 5-10 minutes to
                complete. You can continue using the application while the
                process runs in the background.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRegenerate}>
                Proceed
                <ArrowRight className="size-4" />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {paginationSection}
      </div>
    </div>
  );
};
