import { User } from "../models";
import bcrypt from "bcryptjs";
import { UserInputError, AuthenticationError } from "apollo-server";
import jwt from "jsonwebtoken";

const resolvers = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        console.log(error);
      }
    },
    login: async (_, args) => {
      const { name, password } = args;
      const errors = {};

      if (name.trim() == "") errors.name = "name must not be empty";
      if (password.trim() == "") errors.password = "password must not be empty";

      if (Object.keys(errors).length > 0) {
        throw new UserInputError("bad request", errors);
      }

      const user = await User.findOne({
        where: { name },
      });
      if (!user) {
        errors.user = "user not found";
        throw new UserInputError("user not found", errors);
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        errors.user = "password is incorrect";
        throw new AuthenticationError("password is incorrect", errors);
      }

      const token = jwt.sign(
        {
          name,
        },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 }
      );

      return {
        ...user.toJSON(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        token,
      };
    },
  },

  Mutation: {
    register: async (_, args) => {
      let { name, email, password, confirmPassword } = args;
      const errors = {};
      try {
        // validations
        if (name.trim() == "") errors.name = "name must not be empty";
        if (email.trim() == "") errors.email = "email must not be empty";
        if (password.trim() == "")
          errors.password = "password must not be empty";
        if (confirmPassword.trim() == "")
          errors.confirmPassword = "repeat password must not be empty";
        if (password !== confirmPassword)
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
    },
  },
};

module.exports = { resolvers };
