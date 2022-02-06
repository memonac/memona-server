const User = require("../models/User");

exports.createUser = async (userInfo) => {
  const user = await User.findOne({ email: userInfo.email }).lean().exec();

  if (!user) {
    const newUser = await User.create(userInfo);

    return newUser._id;
  }

  return user._id;
};
