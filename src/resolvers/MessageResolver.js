import { Message, User } from "../models";
import { Op } from "sequelize";

const sendMessage = async ({ content, to }, user) => {
  try {
    if (content.trim() === "") throw new Error("Message is empty");

    const recipient = await User.findOne({ where: { email: to } });
    if (!recipient) throw new Error("User not found");
    else if (recipient.email === user.email)
      throw new Error("You can't message yourself");

    const message = await Message.create({
      from: user.email,
      content,
      to,
    });

    return message;
  } catch (err) {
    throw err;
  }
};

const getMessages = async (from, user) => {
  try {
    if (from == user.email) throw new Error("Please use different email");

    const otherUser = await User.findOne({
      where: {
        email: from,
      },
    });
    if (!otherUser) throw new Error("User not found");

    const userEmails = [user.email, otherUser.email];

    const messages = await Message.findAll({
      where: {
        from: { [Op.in]: userEmails },
        to: { [Op.in]: userEmails },
      },
      order: [["createdAt", "DESC"]],
    });
    return messages;
  } catch (err) {
    throw err;
  }
};

const MessageResolver = {
  Query: {
    getMessages: (_, { from }, { user }) => {
      if (!user) throw new Error("Unauthenticated");
      return getMessages(from, user);
    },
  },
  Mutation: {
    sendMessage: (_, args, { user }) => {
      if (!user) throw new Error("Unauthenticated");
      return sendMessage(args, user);
    },
  },
};

export default MessageResolver;
