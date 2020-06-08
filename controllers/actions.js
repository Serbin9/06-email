const itemModel = require("../models/model");

class Controller {
  findEmail = (value) => itemModel.findOne({ email: value });
  writeUser = (passwordHash, email, name, subscription, avatarURL, otpCode) =>
    itemModel.create({
      name,
      email,
      password: passwordHash,
      subscription,
      avatarURL,
      otpCode,
    });
  findAll = (page, limit, sort) => {
    const options = limit && { page, limit, sort };
    return itemModel.paginate({}, options);
  };

  findAndUpdate = (id, newProperties) =>
    itemModel.findByIdAndUpdate(id, { $set: newProperties }, { new: true });
  findAndDelete = (id) => itemModel.findOneAndDelete(id);
  findById = (id) => itemModel.findById(id);
}
module.exports = new Controller();
