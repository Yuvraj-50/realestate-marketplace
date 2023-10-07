import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/slices/userSlice";

import { useDispatch, useSelector } from "react-redux";

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const userData = await fetch("/api/v1/auth/signin", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await userData.json();

      if (data.success == false) {
        dispatch(signInFailure(data.message));
        return;
      }

      setFormData({
        email: "",
        password: "",
      });

      dispatch(signInSuccess(data.data));

      navigate("/");
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <button
          disabled={loading ? true : false}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading" : "sign in"}
        </button>
      </form>

      {error && <p className="text-red-900">{error}</p>}

      <div className="flex gap-2 mt-5 mx-auto justify-center">
        <p>
          dont have an account ?
          <Link to="/sign-up">
            <span className="text-blue-700"> sign up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
