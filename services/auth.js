const User = require("../models/User");

exports.createUser = async (email) => {
  // 처음 로그인시에만 유저 생성
  // 이후 로그인은 유저 생성 x

  try {
    const user = await User.findOne({ email }).lean().exec();

    if (!user) {
    }
  } catch (err) {}
};
