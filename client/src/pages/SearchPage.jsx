import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard/ListingCard";

function SearchPage() {
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  const [showMore, setShowMore] = useState(false);

  const fetchListings = async (urlParams) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/listing/getListings?${urlParams.toString()}`
      );
      const data = await response.json();
      if (data.data.length > 8) {
        setShowMore(true);
      }

      if (data.data.length < 8) {
        setShowMore(false);
      }

      setLoading(false);
      setListings(data.data);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("searchTerm") || "";
    const type = urlParams.get("type") || "all";
    const parking = urlParams.get("parking") || false;
    const furnished = urlParams.get("furnished") || false;
    const offer = urlParams.get("offer") || false;
    const sort = urlParams.get("sort") || "created_at";
    const order = urlParams.get("order") || "desc";

    setSideBarData({
      searchTerm,
      type,
      parking: parking === "true" ? true : false,
      furnished: furnished === "true" ? true : false,
      offer: offer === "true" ? true : false,
      sort,
      order,
    });

    fetchListings(urlParams);
  }, [window.location.search]);

  const handleChange = (e) => {
    if (
      e.target.id == "rent" ||
      e.target.id == "sale" ||
      e.target.id == "all"
    ) {
      setSideBarData((prev) => {
        return {
          ...prev,
          type: e.target.id,
        };
      });
    }

    if (e.target.name === "sort") {
      const [sort = "created_at", order = "desc"] = e.target.value.split("_");

      setSideBarData((prev) => {
        return {
          ...prev,
          sort,
          order,
        };
      });
    }

    if (e.target.id === "searchTerm") {
      setSideBarData((prev) => {
        return {
          ...prev,
          searchTerm: e.target.value,
        };
      });
    }

    if (
      e.target.id == "parking" ||
      e.target.id == "furnished" ||
      e.target.id == "offer"
    ) {
      setSideBarData((prev) => {
        return {
          ...prev,
          [e.target.id]: e.target.checked,
        };
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const { searchTerm, type, parking, furnished, offer, sort, order } =
      sideBarData;

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchTerm);
    urlParams.set("type", type);
    urlParams.set("parking", parking);
    urlParams.set("furnished", furnished);
    urlParams.set("offer", offer);
    urlParams.set("sort", sort);
    urlParams.set("order", order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMore = async () => {
    const numberlisting = listings.length;
    const params = new URLSearchParams(window.location.search);
    const startIdx = numberlisting;
    params.set("startIndex", startIdx);
    params.toString();
    const response = await fetch(`/api/v1/listing/getListings?${params}`);
    const data = await response.json();
    if (data.data.length < 8) {
      setShowMore(false);
    }
    setListings((prev) => [...prev, ...data.data]);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="search"
              className="border rounded-lg p-3 w-full"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "all"}
              />
              <span>Rent and sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.type === "sale"}
              />
              <span>Sale</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sideBarData.offer}
              />
              <span>offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities</label>

            <div className="flex gap-2">
              <input
                type="checkbox"
                onChange={handleChange}
                checked={sideBarData.parking}
                id="parking"
                className="w-5"
              />
              <span>Parking</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={sideBarData.furnished}
                className="w-5"
              />
              <span>furnished</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort</label>
            <select
              name="sort"
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={handleChange}
              defaultValue={"created_at_desc"}
            >
              <option value="regularprice_desc">price high to low</option>
              <option value="regularprice_asc">price low to high</option>
              <option value="createdAt_desc">latest</option>
              <option value="createdAt_asc">oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white uppercase hover:opacity-95 p-3 rounded-lg">
            Search
          </button>
        </form>
      </div>

      <div>
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {loading && <h1 className="text-3xl ">Loading ....</h1>}
          {!loading && listings.length === 0 && (
            <h1 className="text-3xl ">No listing Found</h1>
          )}
          {!loading &&
            listings?.length > 0 &&
            listings.map((listing) => {
              return <ListingCard key={listing._id} listing={listing} />;
            })}
        </div>
        {showMore && (
          <button
            onClick={onShowMore}
            className="p-7 pl-9 text-green-700 font-semibold hover:underline text-center w-full"
          >
            show more...
          </button>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
