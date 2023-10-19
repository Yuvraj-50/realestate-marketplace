import React, { useEffect, useState } from "react";
import { Link, json, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaLocationArrow,
  FaParking,
} from "react-icons/fa";

import { useSelector } from "react-redux";

function SingleListing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listingData, setListingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState("");

  const { user } = useSelector((state) => state.user);

  const getData = async () => {
    try {
      setError(false);
      setLoading(true);
      const response = await fetch(`/api/v1/listing/${params.id}`);

      const data = await response.json();

      if (data.success == false) {
        setError("Something went wrong");
        setLoading(false);
        return;
      }

      setListingData(data.data);

      setLoading(false);

      setError(false);
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [params.id]);

  const handleContactLandlord = () => {
    setShowContact(true);
  };

  if (loading) {
    return (
      <div className="flex text-2xl flex-col justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error)
    return (
      <div className="flex text-2xl flex-col justify-center items-center min-h-screen">
        {error}
      </div>
    );

  return (
    <main>
      {listingData && (
        <>
          <Swiper navigation>
            {listingData.images.map((image) => (
              <SwiperSlide key={image}>
                <div className="h-[550px]">
                  <img src={image} className="object-cover w-full" alt="" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex flex-col gap-4  my-6 max-w-4xl mx-auto p-1">
            <p className="font-semibold text-2xl">
              {listingData.name} -{"$"}
              {listingData.discountprice > 0
                ? listingData.discountprice
                : listingData.regularprice}
              {listingData.type === "rent" ? " / month" : " / Year"}
            </p>

            <p className="text-state-700 mt-6 my-2">
              <FaLocationArrow className="inline-block"></FaLocationArrow>{" "}
              {listingData.address}
            </p>

            <div className="flex gap-4 mt-2">
              <p className="bg-red-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listingData.type === "rent" ? "For Rent" : "For Sale"}
              </p>

              {listingData.offer && (
                <p className="bg-green-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  $ {+listingData.regularprice - +listingData.discountprice} OFF
                </p>
              )}
            </div>

            <p className="mt-4">
              <span className="font-semibold">Description : </span>
              {listingData.description}
            </p>

            <ul className="flex items-center flex-wrap gap-4 my-5">
              <li className="flex items-center gap-1 text-green-800 font-semibold">
                <FaBed className="text-lg"></FaBed>
                {listingData.bedrooms} Bedrooms
              </li>

              <li className="flex items-center gap-1 text-green-800 font-semibold">
                <FaBath className="text-lg"></FaBath>
                {listingData.baths} Bathrooms
              </li>

              <li className="flex items-center gap-1 text-green-800 font-semibold">
                <FaParking className="text-lg"></FaParking>
                {listingData.parking ? "Parking" : "No Parking"}
              </li>

              <li className="flex items-center gap-1 text-green-800 font-semibold">
                <FaChair className="text-lg"></FaChair>
                {listingData.furnished ? "Furnished" : "Not furnished"}
              </li>
            </ul>
            {user && showContact && (
              <form>
                <p>
                  Contact - {JSON.parse(listingData.userRef).username} for{" "}
                  {listingData.name}
                </p>
                <div>
                  <textarea
                    placeholder="Enter your message"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border p-3 rounded-lg w-full"
                  />
                </div>
                <Link
                  className="w-full"
                  to={`mailto:${
                    JSON.parse(listingData.userRef).email
                  }?subject=Regarding ${listingData.name}&body=${message}`}
                  type="button"
                >
                  <button
                    type="button"
                    className="bg-slate-700 p-3 w-full rounded-lg text-white hover:opacity-80"
                  >
                    Send Message
                  </button>
                </Link>
              </form>
            )}

            {user &&
              JSON.parse(listingData.userRef)._id != user._id &&
              !showContact && (
                <button
                  onClick={handleContactLandlord}
                  className="bg-slate-700 p-3 rounded-lg text-white hover:opacity-80"
                >
                  Contact landlord
                </button>
              )}
          </div>
        </>
      )}
    </main>
  );
}
export default SingleListing;
