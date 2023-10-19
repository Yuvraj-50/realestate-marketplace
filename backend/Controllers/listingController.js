const Listing = require("../models/listing.model");
const User = require("../models/user.model");
const error = require("../utlis/error");

const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(error(404, "Listing not found"));
    }

    if (listing.userRef !== req.user.id) {
      return next(401, "you can delete only your listing");
    }

    await Listing.findByIdAndDelete(listingId);
    res.status(200).json({
      success: true,
      data: "Listing deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateListing = async (req, res, next) => {
  try {
    const listingId = req.params.id;
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(error(404, "Listing not found"));
    }

    if (listing.userRef !== req.user.id) {
      return next(error(401, "you can update only your listing"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      data: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const user = await User.findById(listing.userRef);
    const { password, ...rest } = user;

    listing.userRef = JSON.stringify(rest._doc);

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    let furnished = req.query.furnished;
    let parking = req.query.parking;
    let type = req.query.type;

    const searchTerm = req.query.searchTerm || "";

    const sortBy = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    if (!offer) {
      offer = { $in: [true, false] };
    }

    if (!furnished) {
      furnished = { $in: [true, false] };
    }

    if (!parking) {
      parking = { $in: [true, false] };
    }

    if (!type || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const listing = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      parking,
      furnished,
      type,
    })
      .sort({ [sortBy]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createListing,
  getSingleListing,
  deleteListing,
  updateListing,
  getListings,
};
