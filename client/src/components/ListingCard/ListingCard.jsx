import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

function ListingCard({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-md w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          className="w-full h-[320px] sm:h-[220px] object-cover hover:scale-105 transition-scale duration-300"
          src={listing.images[0]}
          alt=""
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex gap-1 items-center">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-sm  text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p>
            INR{" "}
            {+listing.discountprice > 0
              ? listing.discountprice
              : listing.regularprice}
            {listing.type === "rent" && "/ month"}
          </p>
          <div className="text-slate-800 flex gap-4">
            <div className="font-bold text-sm">
              {listing.bedrooms} beds
            </div>

            <div className="font-bold text-sm">
              {listing.baths} baths
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ListingCard;
