import { Message, User, Reaction } from "../models";
import { Op } from "sequelize";
import { PubSub, withFilter } from "graphql-subscriptions";

const pubSub = new PubSub();

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

    pubSub.publish("NEW_MESSAGE", { newMessage: message });

    return message;
  } catch (err) {
    throw err;
  }
};

const getMessages = async (from, limit, offset, user) => {
  try {
    if (from == user.email) throw new Error("Can't use your own email");

    const otherUser = await User.findOne({
      where: {
        email: from,
      },
    });
    if (!otherUser) throw new Error("User not found");

    const userEmails = [user.email, otherUser.email];

    let allMessages = await Message.findAndCountAll({
      where: {
        from: { [Op.in]: userEmails },
        to: { [Op.in]: userEmails },
      },
      order: [["createdAt", "DESC"]],
      offset,
      limit,
    });

    return {
      allMessages: [...allMessages.rows].reverse(),
      count: allMessages.count,
    };
  } catch (err) {
    throw err;
  }
};

const reactToMessage = async (uuid, content, user) => {
  console.log(user);
  const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
  try {
    if (!reactions.includes(content)) {
      throw new Error("invalid reaction");
    }

    user = await User.findOne({ where: { email: user.email } });
    if (!user) throw new Error("Unauthenticated");

    const message = await Message.findOne({ where: { uuid } });
    if (!message) throw new Error("Message not found");

    if (message.from != user.email && message.to != user.email) {
      throw new Error("Unauthenticated");
    }

    let reaction = await Reaction.findOne({
      where: { messageId: message.id, userId: user.id },
      // include: [
      //   {
      //     model: User,
      //     attributes: ["email", "createdAt", "imageUrl"],
      //   },
      //   {
      //     model: Message,
      //   },
      // ],
    });

    if (reaction) {
      reaction.content = content;
      await reaction.save();
    } else {
      reaction = await Reaction.create(
        {
          messageId: message.id,
          userId: user.id,
          content,
        }
        // include: [
        //   {
        //     model: User,
        //     attributes: ["email", "createdAt", "imageUrl"],
        //   },
        //   {
        //     model: Message,
        //   },
        // ],
      );
    }
    pubSub.publish("NEW_REACTION", { newReaction: reaction });

    return reaction;
  } catch (error) {
    throw new Error(error);
  }
};

const MessageResolver = {
  Query: {
    getMessages: (_, { from, limit, offset }, { user }) => {
      if (!user) throw new Error("Unauthenticated");
      return getMessages(from, limit, offset, user);
    },
  },
  Mutation: {
    sendMessage: (_, args, { user }) => {
      if (!user) throw new Error("Unauthenticated");
      return sendMessage(args, user);
    },
    reactToMessage: (_, { uuid, content }, { user }) => {
      if (!user) throw new Error("Unauthenticated");
      return reactToMessage(uuid, content, user);
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { user }) => {
          if (!user) throw new Error("Unauthenticated");
          return pubSub.asyncIterator(["NEW_MESSAGE"]);
        },
        ({ newMessage }, _, { user }) => {
          if (newMessage.from == user.email || newMessage.to == user.email) {
            return true;
          }
          return false;
        }
      ),
    },
    newReaction: {
      subscribe: withFilter(
        (_, __, { user }) => {
          if (!user) throw new Error("Unauthenticated");
          return pubSub.asyncIterator("NEW_REACTION");
        },
        async ({ newReaction }, _, { user }) => {
          const message = await newReaction.getMessage();
          if (message.from == user.email || message.to == user.email) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};

export default MessageResolver;
