import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";
import {
  useLazyQuery,
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import { GET_USERS } from "@/GraphqlApi/Queries/Users";
import Chat from "@/Components/ChatBox";
import { GET_MESSAGES } from "@/GraphqlApi/Queries/Messages";
import { SEND_MESSAGES } from "@/GraphqlApi/Mutations/SendMessage";
import { toast } from "react-toastify";
import { userAtom } from "@/Store/Atoms/UserAtom";
import { NEW_MESSAGE_SUBSCRIPTION } from "@/GraphqlApi/Subscriptions/NewMessage";
import Loader from "@/Components/Loader";

export default function Home() {
  const user = useRecoilValue(userAtom);
  const [users, setUsers] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [openChat, setOpenChat] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [totalMessages, setTotalMessages] = useState("");
  const [openChatHistory, setOpenChatHistory] = useState("");
  const [messgaeRefIndex, setMessgaeRefIndex] = useState("");
  const [messageNotification, setMessageNotification] = useState([]);

  const { loading: usersLoading } = useQuery(GET_USERS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => setUsers(data.getUsers),
    onError: (err) => console.log(err),
  });

  const {
    data,
    error,
    loading: newMessageLoading,
  } = useSubscription(NEW_MESSAGE_SUBSCRIPTION);

  const handleError = (err) => {
    setOpenChat("");
    setOpenChatHistory("");
    console.log(err);
  };

  const handleMessages = (data) => {
    const { allMessages: tempAllMessages, count } = data.getMessages;
    setTotalMessages(count);
    setMessgaeRefIndex(allMessages.length ? tempAllMessages.length : "");
    setAllMessages([...tempAllMessages, ...allMessages]);
    const updatedUsers = updateUsersWithLatestMessage(
      setAllMessages[setAllMessages.length - 1]
    );
    setUsers(updatedUsers);
    const filterNotification = messageNotification.filter(
      (el) => el.to !== user.email && el.from !== openChat
    );
    setMessageNotification(filterNotification);
  };

  const handleSendMessageError = (err) => {
    console.log(err.message);
    toast.error(err.message);
  };

  const handleSendMessageCompleted = (data) => {
    if (data.sendMessage.from === user.email) {
      setAllMessages((prev) => [...prev, data.sendMessage]);
    }
    const updatedUsers = updateUsersWithLatestMessage(data.sendMessage);
    setUsers(updatedUsers);
    setNewMessage("");
  };

  const [getMessages, { loading: getMessagesLoading }] = useLazyQuery(
    GET_MESSAGES,
    {
      fetchPolicy: "network-only",
      onCompleted: handleMessages,
      onError: handleError,
    }
  );

  const [sendMessage, { loading: sendingMessageloading }] = useMutation(
    SEND_MESSAGES,
    {
      fetchPolicy: "network-only",
      onError: handleSendMessageError,
      onCompleted: handleSendMessageCompleted,
    }
  );

  useEffect(() => {
    if (data && data.newMessage) {
      handleNewMessage(data.newMessage);
    }
  }, [data, newMessageLoading, error]);

  const handleNewMessage = (newMessageData) => {
    const updatedUsers = updateUsersWithLatestMessage(newMessageData);
    setUsers(updatedUsers);
    if (newMessageData.from !== user.email) {
      handleNotificationAndToast(newMessageData);
    }
  };

  const updateUsersWithLatestMessage = (messageData) => {
    return users.map((el) => {
      if (el.email === messageData?.from || el.email === messageData?.to) {
        return { ...el, latestMessage: messageData };
      }
      return el;
    });
  };

  const handleNotificationAndToast = (newMessageData) => {
    if (allMessages.length) {
      setAllMessages((prev) => [...prev, newMessageData]);
    } else {
      setMessageNotification((prev) => [...prev, newMessageData]);
    }
    toast.info(`New message from ${newMessageData.to.split("@")[0]}`);
  };

  const onChatClick = (email) => {
    if (openChat && openChat === email) return;
    setNewMessage("");
    setMessgaeRefIndex("");
    setAllMessages([]);
    setOffset(0);
    getMessages({ variables: { from: email, limit: 10, offset: 0 } });
    setOpenChat(email);
    setOpenChatHistory("");
  };

  const onSend = () => {
    if (!newMessage) return;
    const charactersToRemove = /[@.]/g;
    const resultString = user.email.replace(charactersToRemove, "");
    sendMessage({
      variables: { content: newMessage, to: openChat, from: resultString },
    });
  };

  const loadMoreMessages = () => {
    let newOffset = offset + 10;
    setOffset(newOffset);
    if (openChatHistory) {
      if (openChat !== openChatHistory) {
        setOpenChatHistory(openChat);
      }
    } else {
      setOpenChatHistory(openChat);
    }
    getMessages({
      variables: { from: openChat, limit, offset: newOffset },
    });
  };

  return (
    <>
      {usersLoading ? (
        <Loader />
      ) : (
        <Chat
          user={user}
          users={users}
          onSend={onSend}
          openChat={openChat}
          newMessage={newMessage}
          onChange={setNewMessage}
          onChatClick={onChatClick}
          allMessages={allMessages}
          totalMessages={totalMessages}
          messgaeRefIndex={messgaeRefIndex}
          loadMoreMessages={loadMoreMessages}
          getMessagesLoading={getMessagesLoading}
          messageNotification={messageNotification}
          sendingMessageloading={sendingMessageloading}
        />
      )}
    </>
  );
}
