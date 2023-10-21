import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard/ListingCard";

function Home() {
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);

  SwiperCore.use([Navigation]);


  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const response = await fetch(
          "/api/v1/listing/getListings?offer=true&limit=4"
        );
        const data = await response.json();
        setOfferListing(data.data);
        fetchRentListing();
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchSaleListing = async () => {
      try {
        const response = await fetch(
          "/api/v1/listing/getListings?type=sale&limit=4"
        );
        const data = await response.json();
        setSaleListing(data.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchRentListing = async () => {
      try {
        const response = await fetch(
          "/api/v1/listing/getListings?type=rent&limit=4"
        );
        const data = await response.json();
        setRentListing(data.data);
        fetchSaleListing();
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchOfferListing();
  }, []);


  return (
    <div>
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find you next <span className="text-slate-500">perfect</span> <br />{" "}
          with ease{" "}
        </h1>
        <div className="text-gray-400 text-sm sm:text-lg">
          infiniti escape is a real estate agency that helps you find the
          perfect home
          <br />
          we have a wide range of properties to choose from
        </div>
        <Link
          className="text-sm font-bold text-blue-800 hover:underline"
          to="/search"
        >
          Find a home
        </Link>
      </div>
      {/* sliders */}
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide>
              <div className="h-[500px]" key={listing._id}>
                <img src={listing.images[0]} alt="" />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* result all things */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {/* offer */}

        {offerListing?.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <div
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={`/search?offer=true`}
                >
                  Some more offers
                </Link>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              {offerListing.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* sale */}
        {saleListing?.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <div
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={`/search?type=sale`}
                >
                  Some more houses
                </Link>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              {saleListing.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* rent */}
        {rentListing?.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <div
                onClick={() => {
                  window.scrollTo(0, 0);
                }}
              >
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={`/search?type=rent`}
                >
                  Some more houses
                </Link>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              {rentListing.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
