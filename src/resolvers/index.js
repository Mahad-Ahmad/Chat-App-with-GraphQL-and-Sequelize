import { merge } from "lodash";
import MessageResolver from "./MessageResolver";
import UserResolver from "./UserResolver";

module.exports = merge(
  {
    User: {
      createdAt: (parent) => parent?.createdAt.toISOString(),
    },
    Message: {
      createdAt: (parent) => parent?.createdAt.toISOString(),
    },
  },
  MessageResolver,
  UserResolver
);
