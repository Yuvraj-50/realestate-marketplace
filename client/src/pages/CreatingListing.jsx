import React from "react";

function CreatingListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a listing
      </h1>
      <form className="flex  gap-4 flex-col sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            max={62}
            min={10}
            required
            type="text"
            placeholder="Name"
            id="name"
            className="border  p-3 rounded-lg"
          />
          <textarea
            placeholder="Description"
            required
            type="text"
            id="description"
            className="border  p-3 rounded-lg"
          />
          <input
            placeholder="Address"
            required
            type="text"
            id="Address"
            className="border p-3 rounded-lg"
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min={1}
                max={10}
                required
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="baths"
                min={1}
                max={10}
                required
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="regularprice"
                min={1}
                max={10}
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <p className="text-xs">$ / month</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="discountprice"
                min={1}
                max={10}
                required
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <p className="text-xs">$ / month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              First image will be the cover (max-6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 rounded-lg border-gray-300 w-full"
              type="file"
              id="images"
              accept="imgage/*"
              multiple
            />
            <button className="p-3 disabled:opacity-80 rounded-lg bg-green-700 text-white border-green-700 hover:opacity-95 uppercase shadow-lg">
              Upload
            </button>
          </div>
          <button className="p-3 rounded-lg bg-slate-700 text-white uppercase hover:opacity-95 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreatingListing;
