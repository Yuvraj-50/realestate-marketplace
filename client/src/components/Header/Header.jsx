import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function Header() {
  const { user } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlparams = new URLSearchParams(window.location.search);
    urlparams.set("searchTerm", searchTerm);
    const searchQuery = urlparams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const searchTerm = new URLSearchParams(window.location.search).get(
      "searchTerm"
    );
    setSearchTerm(searchTerm || "");
  }, [window.location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl m-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Infiniti</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <button>
            <FaSearch />
          </button>
        </form>
        <ul className="flex gap-4 items-center">
          <li className="hidden sm:inline text-slate-700 hover:text-slate-400 cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li className="hidden sm:inline text-slate-700 hover:text-slate-400 cursor-pointer">
            <Link to="/about">About</Link>
          </li>

          {user ? (
            <Link to="/profile">
              <img
                className="rounded-full w-8 h-8 object-cover"
                src={user.avatar}
                alt="user-profile-img"
              />
            </Link>
          ) : (
            <li className="text-slate-700 hover:text-slate-400 cursor-pointer">
              <Link to="/sign-in">Sign In</Link>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
