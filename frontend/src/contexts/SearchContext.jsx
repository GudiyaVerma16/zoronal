import { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [headerSearch, setHeaderSearch] = useState("");
  const value = useMemo(
    () => ({ headerSearch, setHeaderSearch }),
    [headerSearch]
  );
  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function useSearchHeader() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearchHeader outside SearchProvider");
  return ctx;
}
