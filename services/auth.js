const User = require("../models/User");

exports.createUser = async (userInfo) => {
  const user = await User.findOne({ email: userInfo.email }).lean().exec();

  if (!user) {
    await User.create(userInfo);
    const newUser = await User.findOne({ email: userInfo.email }).lean().exec();

    return newUser.id;
  }

  return user._id;
};
