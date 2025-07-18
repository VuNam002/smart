const mongoose = require("mongoose");
const { generateRandomString } = require("../helpers/generate");

const accountSchema = new mongoose.Schema(
  {
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generateRandomString(20)
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,
    deleted: {
        type:Boolean,
        default: false,
      },
      deletedAt: Date,
    },
    {
      timestamps: true,
      
    },
    {
      updateBy: String,
      updateAt: Date
    }
);

const Account = mongoose.model("Account", accountSchema, "account");

module.exports = Account;
