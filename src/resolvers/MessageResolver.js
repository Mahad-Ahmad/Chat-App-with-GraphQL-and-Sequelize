import { Message, User } from "../models";
import { UserInputError, AuthenticationError } from "apollo-server";
import { Op } from "sequelize";

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

const getMessages = async (from, user) => {
  if (from == user.email)
    throw new AuthenticationError("please you different email");

  const otherUser = await User.findOne({
    where: {
      email: from,
    },
  });
  if (!otherUser) throw new AuthenticationError("user not found");

  const userEmails = [user.email, otherUser.email];

  const messages = await Message.findAll({
    where: {
      from: { [Op.in]: userEmails },
      to: { [Op.in]: userEmails },
    },
    order: [["createdAt", "DESC"]],
  });
  return messages;
};

const MessageResolver = {
  Query: {
    getMessages: (_, { from }, { user }) => {
      if (!user) throw new AuthenticationError("unauthenticated");
      return getMessages(from, user);
    },
  },
  Mutation: {
    sendMessage: (_, args, { user }) => {
      if (!user) throw new AuthenticationError("unauthenticated");
      return sendMessage(args, user);
    },
  },
};

export default MessageResolver;
