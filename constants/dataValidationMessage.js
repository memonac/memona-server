exports.SCHEMA_MESSAGE = {
  userIdError: "UserId must be required",
  userEmailError: "Email must be unique.",
  userNameError: "UserName must be required",
  messageError: "Comment must be required.",
  sendDateError: "SendDate must be required.",
  roomIdError: "RoomId must be required.",
  authorError: "Author must be required.",
  ownerError: "Owner must be required.",
  formTypeError: "FormType must be required.",
  locationError: "Location must be required.",
  sizeError: "Size must be required.",
  colorError: "Color must be required.",
  roomNameError: "Name must be required",
};

exports.AWS_UPLOAD_MESSAGE = {
  audioFileType: "audio",
  notAudioFile: "Only audios are allowed",
  audioUploadError: "Multer audio upload error",
  imageFileType: "image",
  notImageFile: "Only images are allowed",
  imageUploadError: "Multer image upload error",
};

exports.REQ_BODY_VALIDATION = {
  roomNameError: "Name must be required",
  chatTextError: "Text must be string",
  emailError: "Please check Email",
  alarmDateError: "AlarmDate must be String",
  memoColorError: "Memo Color should be colorCode",
  memoTagsError: "Memo Tags should be string",
  memoTypeError: "Memo Type should be text, image or voice",
  memoWidthError: "Width should be number",
  memoHeightError: "Height should be number",
  memoLeftError: "Left should be number",
  memoTopError: "Top should be number",
};
