import { Message, User } from "../models";
import { UserInputError, AuthenticationError } from "apollo-server";

const sendMessage = async ({ content, to }, user) => {
  try {
    if (content.trim() === "") throw new UserInputError("message is empty");

    const recipient = await User.findOne({ where: { email: to } });
    if (!recipient) throw new AuthenticationError("user not found");
    else if (recipient.email === user.email)
      throw new UserInputError("you can't message yourself");

    const message = await Message.create({
      from: user.email,
      content,
      to,
    });

    return message;
  } catch (error) {
    throw error;
  }
};

const MessageResolver = {
  Mutation: {
    sendMessage: (_, args, { user }) => {
      if (!user) throw new AuthenticationError("unauthenticated");
      return sendMessage(args, user);
    },
  },
};

export default MessageResolver;
