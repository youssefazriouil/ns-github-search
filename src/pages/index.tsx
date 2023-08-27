import forksActiveIcon from "../assets/fork-active.svg";
import forksIcon from "../assets/fork.svg";
import starsActiveIcon from "../assets/stars-active.svg";
import starsIcon from "../assets/stars.svg";
import filterIcon from "../assets/filterIcon.svg";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Octokit } from "@octokit/rest";
import { useQuery } from "react-query";
import { fetchRepos } from "@/utils/fetchRepos";
import { QueryConfig, SortedBy } from "@/utils/types";
import { InferGetStaticPropsType } from "next";
import { useQueryHistory } from "@/hooks/useQueryHistory";
import { useRouter } from "next/router";

// TODO: followers filter seems not to return desired results in combination with stars
export default function Search({
  githubToken,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [sortedBy, setSortedBy] = useState<SortedBy>();
  const queryInputRef = useRef<HTMLInputElement>(null);
  const starsInputRef = useRef<HTMLInputElement>(null);
  const languageInputRef = useRef<HTMLInputElement>(null);
  const [queryConfig, setQueryConfig] = useState<QueryConfig>();
  const { addQueryToHistory, queryHistory } = useQueryHistory();
  const { query } = useRouter();

  const octokit = useMemo(
    () =>
      new Octokit({
        auth: githubToken,
      }),
    [githubToken]
  );

  useEffect(() => {
    const thisQuery = query as unknown as QueryConfig;
    setQueryConfig(thisQuery);
    if (queryInputRef.current) queryInputRef.current.value = thisQuery.q || "";
    if (starsInputRef.current)
      starsInputRef.current.value = thisQuery.starsFilter || "";
    if (languageInputRef.current)
      languageInputRef.current.value = thisQuery.languageFilter || "";
    setSortedBy(thisQuery.sortedBy);
  }, [query]);

  const searchRepo = () => {
    setQueryConfig({
      q: queryInputRef.current?.value || "",
      languageFilter: languageInputRef.current?.value || "",
      starsFilter: starsInputRef.current?.value || "0",
      sortedBy: sortedBy,
    });
  };

  const { data, isLoading, isError } = useQuery(
    ["fetchRepos", queryConfig],
    () => (queryConfig ? fetchRepos(octokit, queryConfig) : null),
    {
      refetchOnWindowFocus: false,
      enabled: !!queryConfig?.q && queryConfig.q.length > 2,
      onSuccess: () => {
        // Add the current query to the query history list
        queryConfig && addQueryToHistory(JSON.stringify(queryConfig));
      },
    }
  );

  return (
    <div className="card glass">
      <div className="card-body">
        <div className="flex items-end">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-lg font-bold">
                Search Github repos
              </span>
            </label>
            <input
              ref={queryInputRef}
              type="text"
              placeholder="E.g. trains"
              className="input input-bordered w-full max-w-xs"
              onKeyDown={({ key }) => key === "Enter" && searchRepo()}
            />
          </div>
          <button className="btn btn-primary ml-2 mr-1" onClick={searchRepo}>
            Search
          </button>
          <div className="dropdown">
            <label tabIndex={0} className="btn ml-1">
              <Image src={filterIcon} className="w-4 h-4" alt="filter" />
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                Number of stars:
                <input
                  ref={starsInputRef}
                  type="number"
                  className="input input-bordered w-full max-w-xs"
                  onKeyDown={({ key }) => key === "Enter" && searchRepo()}
                />
              </li>
              <li>
                Language:
                <input
                  ref={languageInputRef}
                  type="text"
                  className="input input-bordered w-full max-w-xs"
                  onKeyDown={({ key }) => key === "Enter" && searchRepo()}
                />
              </li>
            </ul>
          </div>
        </div>

        {isError ? (
          <span>Could not fetch repos</span>
        ) : (
          <table className="w-full table">
            <thead className="text-left">
              <tr>
                <th>Repository</th>
                <th>
                  <Image
                    src={sortedBy === "stars" ? starsActiveIcon : starsIcon}
                    alt="Sort by stars"
                    className="cursor-pointer"
                    onClick={() => {
                      const newSortedBy =
                        sortedBy === "stars" ? undefined : "stars";
                      setSortedBy(newSortedBy);
                      setQueryConfig({
                        ...queryConfig,
                        sortedBy: newSortedBy,
                      });
                    }}
                  />
                </th>
                <th>
                  <Image
                    src={sortedBy === "forks" ? forksActiveIcon : forksIcon}
                    alt="Sort by forks"
                    className="cursor-pointer"
                    onClick={() => {
                      const newSortedBy =
                        sortedBy === "forks" ? undefined : "forks";
                      setSortedBy(newSortedBy);
                      setQueryConfig({
                        ...queryConfig,
                        sortedBy: newSortedBy,
                      });
                    }}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td>
                    <span className="loading loading-spinner loading-lg"></span>
                  </td>
                </tr>
              ) : !data?.length ? (
                <tr>
                  <td>No repos found</td>
                </tr>
              ) : (
                (data || []).map((repo, index) => (
                  <tr key={index}>
                    <td className="pb-2">
                      <a className="link link-secondary" href={repo.html_url}>
                        {repo.full_name}
                      </a>
                    </td>
                    <td>{repo.stargazers_count}</td>
                    <td>{repo.forks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  return { props: { githubToken: process.env.NEXT_MY_GITHUB_TOKEN } };
}
