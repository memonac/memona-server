const User = require("../models/User");

exports.createUser = async (userInfo) => {
  const user = await User.findOne({ email: userInfo.email }).lean().exec();

  if (!user) {
    return await User.create(userInfo);
  }
};
