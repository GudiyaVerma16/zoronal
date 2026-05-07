import { Link, useNavigate } from "react-router-dom";
import { useSearchHeader } from "../contexts/SearchContext.jsx";

function IconSearch() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="M16 16l5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const { headerSearch, setHeaderSearch } = useSearchHeader();
  const navigate = useNavigate();

  function submitSearch(e) {
    e.preventDefault();
    const q = headerSearch.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
              <path d="M12 2l3 7 7 .5-5 4 2 7-7-4-7 4 2-7-5-4 7-.5z" />
            </svg>
          </span>
          <span className="brand-text">
            <span className="brand-review">Review</span>
            <span className="brand-bold">&RATE</span>
          </span>
        </Link>

        <form className="header-search" onSubmit={submitSearch}>
          <input
            type="search"
            placeholder="Search..."
            value={headerSearch}
            onChange={(e) => setHeaderSearch(e.target.value)}
            aria-label="Search companies"
          />
          <button type="submit" className="header-search-btn" aria-label="Search">
            <IconSearch />
          </button>
        </form>

        <nav className="header-nav">
          <a href="#signup" className="header-link">
            SignUp
          </a>
          <a href="#login" className="header-link">
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
