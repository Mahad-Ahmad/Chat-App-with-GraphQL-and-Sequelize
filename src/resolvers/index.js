import { merge } from "lodash";
import MessageResolver from "./MessageResolver";
import UserResolver from "./UserResolver";

module.exports = merge(MessageResolver, UserResolver);
