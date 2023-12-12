import { User } from "../models";
import bcrypt from "bcryptjs";
const { Op } = require("sequelize");
import jwt from "jsonwebtoken";

const getUsers = async (user) => {
  try {
    const users = await User.findAll({
      where: {
        email: {
          [Op.ne]: [user.email],
        },
      },
    });
    return users;
  } catch (err) {
    throw err;
  }
};

const getUser = async (email) => {
  try {
    const foundedUser = await User.findOne({
      where: { email },
    });
    if (!foundedUser) {
      throw new Error("User not found");
    }
    return foundedUser;
  } catch (err) {
    throw err;
  }
};

const login = async (args) => {
  const { email, password } = args;

  try {
    if (email.trim() == "") throw new Error("Email must not be empty");
    if (password.trim() == "") throw new Error("Password must not be empty");

    const user = await getUser(email);

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      throw new Error("Password is incorrect");
    }

    const token = jwt.sign(
      {
        email,
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    return {
      ...user.toJSON(),
      updatedAt: user.updatedAt.toISOString(),
      token,
    };
  } catch (err) {
    throw err;
  }
};

const register = async (args) => {
  let { name, email, password, confirmPassword } = args;
  try {
    // validations
    if (name.trim() == "") throw new Error("Name must not be empty");
    if (email.trim() == "") throw new Error("Nmail must not be empty");
    if (password.trim() == "") throw new Error("Password must not be empty");
    if (confirmPassword.trim() == "")
      throw new Error("Repeat password must not be empty");
    if (password != confirmPassword) throw new Error("Passwords must match");

    // check if name/email already exist
    // const userByName = await User.findOne({ where: { name } });
    // const userByEmail = await User.findOne({ where: { email } });

    // if (userByName) errors.name = "username is taken";
    // if (userByEmail) errors.email = "email is taken";

    // password hashing
    password = await bcrypt.hash(password, 6);

    // create user
    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });
    // return user
    return user;
  } catch (err) {
    // if (err.name === "SequelizeUniqueConstraintError") {
    //   err.errors.forEach((e) => {
    //     errors[e.path] = `${e.path} is already taken`;
    //   });
    // } else if (err.name === "SequelizeValidationError") {
    //   err.errors.forEach((e) => {
    //     errors[e.path] = e.message;
    //   });
    // }
    // throw new UserInputError("Bad Input", { errors })
    throw err;
  }
};

const UserResolver = {
  Query: {
    getUsers: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthenticated");
      return getUsers(user);
    },
    getUser: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthenticated");
      return getUser(user);
    },
    login: async (_, args) => {
      return login(args);
    },
  },

  Mutation: {
    register: async (_, args) => {
      return register(args);
    },
  },
};

export default UserResolver;
