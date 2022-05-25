var mongoose = require("mongoose");
let Joi = require("joi");

let picturesSchema = mongoose.Schema({
  Title: String,
  Price: Number,
  image: String,
});

let Picture = mongoose.model("Pictures", picturesSchema);

function validatePictureDetails(data) {
  const schema = Joi.object({
    Title: Joi.string().min(3).max(20).required(),
    Price: Joi.number().min(0).max(2000).required(),
  });
  return schema.validate(data, { abortEarly: false });
}

module.exports.Picture = Picture;
module.exports.pictureValidation = validatePictureDetails;
