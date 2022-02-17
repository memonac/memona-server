const User = require("../models/User");

exports.createUser = async (userInfo) => {
  const user = await User.findOne({ email: userInfo.email }).lean().exec();

  if (!user) {
    const newUser = await User.create(userInfo);

    return {
      id: newUser._id,
      name: newUser.name,
    };
  }

  return {
    id: user._id,
    name: user.name,
  };
};
