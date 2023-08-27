import { ReactNode, createContext, useState } from "react";

export const QueryHistoryContext = createContext<{
  queryHistory: string[];
  addQueryToHistory: (q: string) => void;
}>({ addQueryToHistory: () => null, queryHistory: [] });

export const QueryHistoryContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  const addQueryToHistory = (query: string) => {
    setQueryHistory((prevHistory) => [...prevHistory, query]);
  };

  const contextValue = {
    queryHistory,
    addQueryToHistory,
  };

  return (
    <QueryHistoryContext.Provider value={contextValue}>
      {children}
    </QueryHistoryContext.Provider>
  );
};
