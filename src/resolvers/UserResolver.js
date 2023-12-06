import { User } from "../models";
import bcrypt from "bcryptjs";
import { UserInputError, AuthenticationError } from "apollo-server";
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
  } catch (error) {
    throw error;
  }
};

const getUser = async (user) => {
  let errors = {};
  try {
    const rr = await User.findOne({
      where: { email: user.email },
    });
    if (!rr) {
      errors.user = "user not found";
      throw new UserInputError("user not found", errors);
    }
    return rr;
  } catch (err) {
    // throw err;
    console.log(errors);
    throw new UserInputError("Bad Input", { errors });
  }
};

const login = async (args) => {
  const { email, password } = args;
  const errors = {};

  try {
    if (email.trim() == "") errors.email = "email must not be empty";
    if (password.trim() == "") errors.password = "password must not be empty";

    if (Object.keys(errors).length > 0) {
      throw new UserInputError("bad request", errors);
    }

    const user = await getUser(email);
    // const user = await User.findOne({
    //   where: { email },
    // });
    if (!user) {
      errors.user = "user not found";
      throw new UserInputError("user not found", errors);
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      errors.password = "password is incorrect";
      throw new UserInputError("password is incorrect", errors);
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
    throw new UserInputError("Bad Input", { errors });
  }
};

const register = async (args) => {
  let { name, email, password, confirmPassword } = args;
  const errors = {};
  try {
    // validations
    if (name.trim() == "") errors.name = "name must not be empty";
    if (email.trim() == "") errors.email = "email must not be empty";
    if (password.trim() == "") errors.password = "password must not be empty";
    if (confirmPassword.trim() == "")
      errors.confirmPassword = "repeat password must not be empty";
    if (password != confirmPassword)
      errors.confirmPassword = "passwords must match";

    // check if name/email already exist
    // const userByName = await User.findOne({ where: { name } });
    // const userByEmail = await User.findOne({ where: { email } });

    // if (userByName) errors.name = "username is taken";
    // if (userByEmail) errors.email = "email is taken";

    if (Object.keys(errors).length > 0) {
      throw errors;
    }

    // password hashing
    password = await bcrypt.hash(password, 6);

    // create user
    const users = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });
    // return user
    return users;
  } catch (err) {
    console.log(err);
    if (err.name === "SequelizeUniqueConstraintError") {
      err.errors.forEach((e) => {
        errors[e.path] = `${e.path} is already taken`;
      });
    } else if (err.name === "SequelizeValidationError") {
      err.errors.forEach((e) => {
        errors[e.path] = e.message;
      });
    }
    throw new UserInputError("Bad Input", { errors });
  }
};

const UserResolver = {
  Query: {
    getUsers: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("unauthenticated");
      return getUsers(user);
    },
    getUser: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("unauthenticated");
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
