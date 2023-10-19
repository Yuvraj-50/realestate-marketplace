import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Header from "./components/Header/Header";
import PrivateRoute from "./components/ProtectedRoutes/PrivateRoute";
import CreatingListing from "./pages/CreatingListing";
import SingleListing from "./pages/SingleListing";
import EditListing from "./pages/EditListing";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/listing/:id" element={<SingleListing />} />
        <Route path="/search" element={<SearchPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/createlisting" element={<CreatingListing />} />
          <Route path="/editlisting/:listingId" element={<EditListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
