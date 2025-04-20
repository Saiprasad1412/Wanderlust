const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "Title is required."
    }),
    description: Joi.string().required().messages({
        "string.empty": "Description is required."
    }),
    image: Joi.string().messages({
        "string.empty": "Image URL is required.",
    }),
    price: Joi.number().positive().required().messages({
        "number.base": "Price must be a number.",
        "number.positive": "Price must be greater than zero."
    }),
    location: Joi.string().required().messages({
        "string.empty": "Location is required."
    }),
    country: Joi.string().required().messages({
        "string.empty": "Country is required."
    })
});

// Reviews Validation
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});

