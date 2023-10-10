import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInStart,
  signOutUserFailure,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/slices/userSlice";

import { app } from "../utils/firebase";

function Profile() {
  const { user, loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileUploadErr, setFileUploadErr] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProgress(Math.round(progress));
      },
      (error) => {
        setFileUploadErr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData((prev) => {
            return { ...prev, avatar: downloadURL };
          });
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (Object.keys(formData).length === 0) {
        return;
      }

      dispatch(updateUserStart());

      const response = await fetch(`/api/v1/users/update/${user._id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success == false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data.data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/v1/users/delete/${user._id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success == false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess());
      console.log(data);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signInStart());

      const response = await fetch(`/api/v1/auth/signout/${user._id}`);

      const data = await response.json();

      if (data.success == false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full object-cover h-24 w-24 self-center p-2 hover:cursor-pointer"
          src={formData.avatar ? formData.avatar : user.avatar}
          alt="profile"
        />
        <p className="text-center">
          {fileUploadErr ? (
            <span className="text-red-700">
              Error uploading file (image must be less than 2mb)
            </span>
          ) : fileProgress > 0 && fileProgress < 100 ? (
            <span className="text-slate-700">{`File Uploading ${fileProgress} %`}</span>
          ) : fileProgress == 100 ? (
            <span className="text-green-600">File Uploaded Successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={user.username}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="email"
          className="border p-3"
          id="email"
          defaultValue={user.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 p-3"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          className="text-center bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
          to="/createlisting"
        >
          create Listing
        </Link>
      </form>
      <div className="flex m-5 justify-between">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 hover:cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 hover:cursor-pointer"
        >
          Sign out
        </span>
      </div>

      {error && <p className="text-red-700"> {error} </p>}
      {updateSuccess && (
        <p className="text-green-700"> User updated successfully </p>
      )}
    </div>
  );
}

export default Profile;
