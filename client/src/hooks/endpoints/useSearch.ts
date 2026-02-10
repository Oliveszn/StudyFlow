import {
  GlobalSearchResponse,
  searchApi,
  SearchCoursesResponse,
  SearchInstructorsResponse,
  SearchSuggestionsResponse,
} from "@/api/endpoints/search";
import { useQuery } from "@tanstack/react-query";

export const useGlobalSearch = (params: Record<string, any>) => {
  return useQuery<GlobalSearchResponse>({
    queryKey: ["search", "global", params],
    queryFn: () => searchApi.globalSearch(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useSearchCourses = (params: Record<string, any>) => {
  return useQuery<SearchCoursesResponse>({
    queryKey: ["search", "courses", params],
    queryFn: () => searchApi.searchCourses(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useSearchInstructors = (params: Record<string, any>) => {
  return useQuery<SearchInstructorsResponse>({
    queryKey: ["search", "instructors", params],
    queryFn: () => searchApi.searchInstructors(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useSearchSuggestions = (params: { q: string; limit?: number }) => {
  return useQuery<SearchSuggestionsResponse>({
    queryKey: ["search", "suggestions", params],
    queryFn: () => searchApi.getSearchSuggestions(params),
    staleTime: 15 * 60 * 1000,
    retry: 2,
  });
};
