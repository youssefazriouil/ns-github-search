import { QueryHistoryContext } from "@/providers/QueryHistoryContextProvider";
import { useContext } from "react";

export const useQueryHistory = () => {
  const context = useContext(QueryHistoryContext);
  return context;
};
