import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth/OAuth";

function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setError(null);
    setFormData((prev) => {
      return { ...prev, [e.target.id]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userData = await fetch("/api/v1/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await userData.json();

      if (data.success == false) {
        setLoading(false);
        return setError(data.message);
      }

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      navigate("/sign-in");
    } catch (err) {
      setError(data.message);
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="UserName"
          className="border p-3 rounded-lg"
          id="username"
          value={formData.username}
          onChange={handleInputChange}
        />
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
          {loading ? "loading" : "sign up"}
        </button>
        <OAuth />
      </form>

      {error && <p className="text-red-900">{error}</p>}

      <div className="flex gap-2 mt-5 mx-auto justify-center">
        <p>
          Have an account ?
          <Link to="/sign-in">
            <span className="text-blue-700"> sign in</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
