const Joi = require("joi");

const ImageHeadersSchema = Joi.object({
  "content-type": Joi.string()
    .valid(
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp"
    )
    .required(),
  _data: Joi.binary()
    .max(512 * 1024)
    .message("File size should be less than 512KB"),
}).unknown();

module.exports = { ImageHeadersSchema };
