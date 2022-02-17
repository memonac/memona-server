const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = require("../../configs/awsS3");
const { AWS_UPLOAD_MESSAGE } = require("../../constants/dataValidationMessage");

const storage = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  key: function (req, file, callback) {
    try {
      const fileType =
        file.mimetype.split("/")[0] !== AWS_UPLOAD_MESSAGE.audioFileType;

      if (fileType) {
        return callback(new Error(AWS_UPLOAD_MESSAGE.notAudioFile));
      }

      const fileNameArray = file.originalname.split(".");
      callback(
        null,
        "audio" + Date.now() + "." + fileNameArray[fileNameArray.length - 1]
      );
    } catch (err) {
      return callback(new Error(AWS_UPLOAD_MESSAGE.audioUploadError));
    }
  },
  acl: "public-read",
});

const audioUploadToAwsS3 = multer({
  storage,
});

module.exports = audioUploadToAwsS3;
