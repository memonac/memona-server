const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../../configs/awsS3");

const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  key: function (req, file, cb) {
    try {
      const fileType = file.mimetype.split("/")[0] !== "image";

      if (fileType) {
        return cb(new Error("Only images are allowed"));
      }

      const fileNameArray = file.originalname.split(".");
      cb(
        null,
        "img" + Date.now() + "." + fileNameArray[fileNameArray.length - 1]
      );
    } catch (err) {
      return cb(new Error("multer image upload error"));
    }
  },
  acl: "public-read",
});

const uploadToAwsS3 = multer({
  storage,
});

module.exports = uploadToAwsS3;
