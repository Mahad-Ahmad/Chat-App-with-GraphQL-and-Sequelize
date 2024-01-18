import { merge } from "lodash";
import { Message, User, Reaction } from "../models";
import MessageResolver from "./MessageResolver";
import UserResolver from "./UserResolver";

module.exports = merge(
  {
    User: {
      createdAt: (parent) => parent?.createdAt.toISOString(),
    },
    Reaction: {
      createdAt: (parent) => parent?.createdAt.toISOString(),
      Message: async (parent) => await Message.findByPk(parent.messageId),
      User: async (parent) =>
        await User.findByPk(parent.userId, {
          attributes: ["email", "createdAt", "imageUrl"],
        }),
    },
    Message: {
      createdAt: (parent) => parent?.createdAt.toISOString(),
    },
  },
  MessageResolver,
  UserResolver
);
