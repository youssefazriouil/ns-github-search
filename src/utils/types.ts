export type SortedBy = "stars" | "forks" | undefined;

export interface QueryConfig {
  q?: string;
  starsFilter?: string;
  languageFilter?: string;
  sortedBy: SortedBy;
}
