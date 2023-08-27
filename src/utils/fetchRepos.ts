import { Octokit } from "@octokit/rest";
import { QueryConfig, SortedBy } from "./types";

export const fetchRepos = async (
  octokit: Octokit,
  { q, starsFilter, languageFilter, sortedBy }: QueryConfig
) => {
  if (q) {
    const response = await octokit.request("GET /search/repositories", {
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
      q: `${q} in:name,description,topics,readme stars:>=${starsFilter ?? 0} ${
        languageFilter ?? ""
      }`,
      sort: sortedBy,
    });
    return response.data.items;
  } else {
    return [];
  }
};
