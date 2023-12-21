import { merge } from "lodash";
import MessageResolver from "./MessageResolver";
import UserResolver from "./UserResolver";

module.exports = merge(
  {
    Message: {
      createdAt: (parent) => parent.createdAt.toISOString(),
    },
    User: {
      createdAt: (parent) => parent.createdAt.toISOString(),
    },
  },
  MessageResolver,
  UserResolver
);
