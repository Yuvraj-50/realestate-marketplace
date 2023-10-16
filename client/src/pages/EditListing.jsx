import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../utils/firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function EditListing() {
  const params = useParams();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    images: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    baths: 1,
    regularprice: 50,
    discountprice: 0,
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [imageUploadErr, setImageUploadErr] = useState("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetListing = async () => {
      try {
        const response = await fetch("/api/v1/listing/" + params.listingId);
        let data = await response.json();
        if (data.success == false) {
          console.log(data.message);
          return;
        }

        data = data.data;

        setFormData({
          images: data.images,
          name: data.name,
          description: data.description,
          address: data.address,
          type: data.type,
          parking: data.parking,
          furnished: data.furnished,
          offer: data.offer,
          bedrooms: data.bedrooms,
          baths: data.baths,
          regularprice: data.regularprice,
          discountprice: data.discountprice,
        });
      } catch (error) {
        console.log(error.message);
      }
    };
    fetListing();
  }, []);

  const storeImage = (image) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);

      const fileName = new Date().getTime() + image.name;

      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleImageSubmit = (e) => {
    if (images.length === 0) {
      setImageUploadErr("select new image to upload");
      return;
    }
    if (images.length > 0 && images.length + formData.images.length < 7) {
      setUploading(true);
      setImageUploadErr("");
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }

      Promise.all(promises)
        .then((url) => {
          setImages([]);
          setFormData((prev) => {
            return { ...prev, images: [...formData.images, ...url] };
          });
          setImageUploadErr("");
          setUploading(false);
        })
        .catch(() => {
          setUploading(false);
          setImageUploadErr("Image upload error (max 2 mb per image allowed)");
        });
    } else {
      setUploading(false);
      setImageUploadErr("You can only upload 6 images");
    }
  };

  const handleRemoveImage = (idx) => {
    setFormData((prev) => {
      return {
        ...prev,
        images: formData.images.filter((_, imgIdx) => imgIdx !== idx),
      };
    });
  };

  const handleInputChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData((prev) => {
        return {
          ...prev,
          type: e.target.id,
        };
      });
    } else if (e.target.value == "on" || e.target.value == "off") {
      setFormData((prev) => {
        return {
          ...prev,
          [e.target.id]: e.target.checked ? true : false,
        };
      });
    } else {
      setFormData((prev) => {
        return {
          ...prev,
          [e.target.id]: e.target.value == "on" ? true : e.target.value,
        };
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      return setError("You must upload at least one image");
    }

    if (+formData.regularprice < +formData.discountprice) {
      return setError("Discount price must be less than regular price");
    }

    try {
      setError("");
      setLoading(true);

      formData.userRef = user._id;

      const response = await fetch(
        "/api/v1/listing/update/" + params.listingId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      console.log(data, "updataed");

      if (data.success == false) {
        setError(data.message);
        setLoading(false);
      }

      setLoading(false);

      setFormData({
        images: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        parking: false,
        furnished: false,
        offer: false,
        bedrooms: 0,
        baths: 0,
        regularprice: 0,
        discountprice: 0,
      });
      // navigate(`/listing/${data.data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a listing
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="flex  gap-4 flex-col sm:flex-row"
      >
        <div className="flex flex-col gap-4 flex-1">
          <input
            required
            type="text"
            placeholder="Name"
            id="name"
            className="border  p-3 rounded-lg"
            value={formData.name}
            onChange={handleInputChange}
          />

          <textarea
            placeholder="Description"
            required
            type="text"
            id="description"
            className="border  p-3 rounded-lg"
            value={formData.description}
            onChange={handleInputChange}
          />

          <input
            placeholder="Address"
            required
            type="text"
            id="address"
            className="border p-3 rounded-lg"
            value={formData.address}
            onChange={handleInputChange}
          />

          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                onChange={handleInputChange}
                checked={formData.type === "sale"}
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleInputChange}
                checked={formData.type === "rent"}
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                onChange={handleInputChange}
                checked={formData.parking}
                className="w-5"
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleInputChange}
                checked={formData.furnished}
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleInputChange}
                checked={formData.offer}
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                onChange={handleInputChange}
                value={formData.bedrooms}
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
                onChange={handleInputChange}
                value={formData.baths}
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
                onChange={handleInputChange}
                value={formData.regularprice}
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="regularprice"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <p className="text-xs">$ / month</p>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  onChange={handleInputChange}
                  value={formData.discountprice}
                  className="p-3 border-gray-300 rounded-lg"
                  type="number"
                  id="discountprice"
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  <p className="text-xs">$ / month</p>
                </div>
              </div>
            )}
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
              onChange={(e) => setImages(e.target.files)}
              className="p-3 rounded-lg border-gray-300 w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 disabled:opacity-80 rounded-lg bg-green-700 text-white border-green-700 hover:opacity-95 uppercase shadow-lg"
            >
              {uploading ? "uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadErr && (
            <p className="text-red-700 text-sm"> {imageUploadErr} </p>
          )}
          {formData.images.length > 0 &&
            formData.images.map((image, idx) => (
              <div
                key={image}
                className="flex justify-between items-center p-3 border"
              >
                <img
                  key={image}
                  className="w-20 h-20 object-contain rounded-lg"
                  src={image}
                />
                <button
                  onClick={() => handleRemoveImage(idx)}
                  type="button"
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 rounded-lg bg-slate-700 text-white uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Update Listing"}
          </button>
          {error && <p className="text-red-700 text-sm"> {error} </p>}
        </div>
      </form>
    </main>
  );
}

export default EditListing;
