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

export default function Home() {
  const user = useRecoilValue(userAtom);
  const [users, setUsers] = useState([]);
  const [openChat, setOpenChat] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageNotification, setMessageNotification] = useState([]);

  const { loading } = useQuery(GET_USERS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const { getUsers } = data;
      setUsers(getUsers);
    },
    onError: (err) => console.log(err),
  });

  const [getMessages, { messageLoading }] = useLazyQuery(GET_MESSAGES, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      setAllMessages([...data.getMessages].reverse());
      const updatedUsers = users.map((el) => {
        if (el.email === data?.sendMessage?.to) {
          return { ...el, latestMessage: data?.sendMessage };
        }
        return el;
      });
      setUsers(updatedUsers);
    },
    onError: (err) => {
      setOpenChat("");
      console.log(err);
    },
  });

  useEffect(() => {
    const filterNotification = messageNotification.filter(
      (el) => el.to !== user.email
    );
    setMessageNotification(filterNotification);
  }, [allMessages]);

  console.log(messageNotification, "messageNotification");

  const { data, error, newMessageLoading } = useSubscription(
    NEW_MESSAGE_SUBSCRIPTION
  );

  useEffect(() => {
    if (data) {
      if (data.newMessage.from !== user.email) {
        setMessageNotification((prev) => [...prev, data.newMessage]);
        toast.info(`New message from ${data.newMessage.to.split("@")[0]}`);
      }
    } else if (loading) {
      // toast.info("loading");
    }
    if (error) {
      toast.error(error.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [data, error, newMessageLoading]);

  const [sendMessage, { sendingMessageloading }] = useMutation(SEND_MESSAGES, {
    fetchPolicy: "network-only",
    onError: (err) => {
      console.log(err.message);
      toast.error(err.message);
    },
    onCompleted: (data) => {
      setAllMessages((prev) => [...prev, data.sendMessage]);
      const updatedUsers = users.map((el) => {
        if (el.email === data?.sendMessage?.to) {
          return { ...el, latestMessage: data?.sendMessage };
        }
        return el;
      });
      setUsers(updatedUsers);
      setNewMessage("");
    },
  });

  const onChatClick = (email) => {
    if (openChat && openChat == email) return;
    setNewMessage("");
    setAllMessages([]);
    getMessages({
      variables: { from: email },
    });
    setOpenChat(email);
  };
  const onSend = () => {
    if (!newMessage) return;
    const charactersToRemove = /[@.]/g;
    const resultString = user.email.replace(charactersToRemove, "");
    sendMessage({
      variables: { content: newMessage, to: openChat, from: resultString },
    });
  };

  return (
    <>
      {messageLoading ? (
        <div>loading...</div>
      ) : (
        <Chat
          user={user}
          allMessages={allMessages}
          messageNotification={messageNotification}
          openChat={openChat}
          users={users}
          onSend={onSend}
          newMessage={newMessage}
          onChange={setNewMessage}
          onChatClick={onChatClick}
        />
      )}
    </>
  );
}
