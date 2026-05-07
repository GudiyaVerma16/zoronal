import { Outlet } from "react-router-dom";
import { SearchProvider } from "../contexts/SearchContext.jsx";
import Header from "./Header.jsx";

export default function Layout() {
  return (
    <SearchProvider>
      <Header />
      <main className="main-shell">
        <Outlet />
      </main>
    </SearchProvider>
  );
}
