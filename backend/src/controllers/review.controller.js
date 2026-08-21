const mongoose = require("mongoose");
const { Repair, Review, TechnicianProfile } = require("../models");

function badRequest(message, details = []) {
  const error = new Error(message);
  error.statusCode = 400;
  error.details = details;
  return error;
}
function parseId(value, field) {
  if (!mongoose.isValidObjectId(value))
    throw badRequest(`Invalid ${field}`, [
      { field, message: `${field} must be a valid id` },
    ]);
  return new mongoose.Types.ObjectId(value);
}
function safeCustomer(customer) {
  return customer
    ? { id: customer._id, name: customer.name, avatar: customer.avatar }
    : null;
}

async function refreshTechnicianRating(technicianId) {
  const [summary] = await Review.aggregate([
    { $match: { technicianId } },
    {
      $group: {
        _id: "$technicianId",
        average: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  await TechnicianProfile.findOneAndUpdate(
    { userId: technicianId },
    {
      $set: {
        ratingAverage: summary ? Math.round(summary.average * 10) / 10 : 0,
        totalReviews: summary?.count || 0,
      },
    },
  );
}

async function createReview(req, res, next) {
  try {
    const repairId = parseId(req.params.repairId, "repairId");
    const { rating, comment } = req.body || {};
    if (!Number.isInteger(rating) || rating < 1 || rating > 5)
      throw badRequest("Rating must be an integer from 1 to 5", [
        { field: "rating", message: "Choose a rating from 1 to 5" },
      ]);
    if (
      comment !== undefined &&
      (typeof comment !== "string" || comment.trim().length > 1000)
    )
      throw badRequest("Comment must be 1000 characters or fewer", [
        { field: "comment", message: "Shorten your comment" },
      ]);
    const repair = await Repair.findOne({
      _id: repairId,
      customerId: req.auth.userId,
    }).select("customerId technicianId status");
    if (!repair)
      return res
        .status(404)
        .json({
          success: false,
          message: "Completed repair not found",
          errors: [],
        });
    if (repair.status !== "COMPLETED")
      return res
        .status(422)
        .json({
          success: false,
          message: "You can review a repair only after it is completed",
          errors: [],
        });
    if (!repair.technicianId)
      return res
        .status(422)
        .json({
          success: false,
          message: "This repair has no assigned technician",
          errors: [],
        });
    const review = await Review.create({
      repairId,
      customerId: req.auth.userId,
      technicianId: repair.technicianId,
      rating,
      comment: comment?.trim(),
    });
    await refreshTechnicianRating(repair.technicianId);
    const populated = await Review.findById(review._id)
      .populate({ path: "customerId", select: "name avatar" })
      .lean();
    return res
      .status(201)
      .json({
        success: true,
        message: "Review submitted successfully",
        data: {
          review: {
            id: populated._id,
            rating: populated.rating,
            comment: populated.comment,
            createdAt: populated.createdAt,
            customer: safeCustomer(populated.customerId),
          },
        },
      });
  } catch (error) {
    if (error?.code === 11000)
      return res
        .status(409)
        .json({
          success: false,
          message: "You have already reviewed this repair",
          errors: [],
        });
    return next(error);
  }
}

async function listTechnicianReviews(req, res, next) {
  try {
    const technicianId = parseId(req.params.technicianId, "technicianId");
    const page = Number.parseInt(req.query.page || "1", 10);
    const limit = Number.parseInt(req.query.limit || "10", 10);
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 50
    )
      throw badRequest("Invalid pagination", [
        {
          field: "page",
          message: "Page must be positive and limit must be between 1 and 50",
        },
      ]);
    const [reviews, total] = await Promise.all([
      Review.find({ technicianId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({ path: "customerId", select: "name avatar" })
        .lean(),
      Review.countDocuments({ technicianId }),
    ]);
    return res.json({
      success: true,
      message: "Technician reviews retrieved",
      data: {
        reviews: reviews.map((review) => ({
          id: review._id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          customer: safeCustomer(review.customerId),
        })),
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createReview, listTechnicianReviews };
