import { User } from "../models";
import bcrypt from "bcryptjs";
import { UserInputError, AuthenticationError } from "apollo-server";
const { Op } = require("sequelize");
import jwt from "jsonwebtoken";

const resolvers = {
  Query: {
    getUsers: async (_, __, context) => {
      try {
        let user;
        if (context.req && context.req.headers.authorization) {
          const token = context.req.headers.authorization.split("Bearer ")[1];
          jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if (err) {
              throw new AuthenticationError("unauthenticated");
            }
            user = decodedToken;
          });
        }

        const users = await User.findAll({
          where: {
            name: {
              [Op.ne]: [user.name],
            },
          },
        });
        return users;
      } catch (error) {
        throw error;
      }
    },
    login: async (_, args) => {
      const { email, password } = args;
      const errors = {};
      
      try {
        if (email.trim() == "") errors.email = "email must not be empty";
        if (password.trim() == "")
          errors.password = "password must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad request", errors);
        }

        const user = await User.findOne({
          where: { email },
        });
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
    },
  },

  Mutation: {
    register: async (_, args) => {
      let { name, email, password, confirmPassword } = args;
      const errors = {};
      console.log(password, "confirmPassword", confirmPassword);
      try {
        // validations
        if (name.trim() == "") errors.name = "name must not be empty";
        if (email.trim() == "") errors.email = "email must not be empty";
        if (password.trim() == "")
          errors.password = "password must not be empty";
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
    },
  },
};

module.exports = { resolvers };
