import { useRecoilValue } from "recoil";
import { useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_USERS } from "@/GraphqlApi/Queries/Users";
import Chat from "@/Components/ChatBox";
import { GET_MESSAGES } from "@/GraphqlApi/Queries/Messages";
import { SEND_MESSAGES } from "@/GraphqlApi/Mutations/SendMessage";
import { toast } from "react-toastify";
import { userAtom } from "@/Store/Atoms/UserAtom";

export default function Home() {
  const user = useRecoilValue(userAtom);
  const [users, setUsers] = useState([]);
  const [openChat, setOpenChat] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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
    },
    onError: (err) => {
      setOpenChat("");
      console.log(err);
    },
  });

  const [sendMessage, { sendingMessageloading }] = useMutation(SEND_MESSAGES, {
    fetchPolicy: "network-only",
    onError: (err) => {
      console.log(err.message);
      toast.error(err.message);
    },
    onCompleted: (data) => {
      setAllMessages((prev) => [...prev, data.sendMessage]);
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
    sendMessage({
      variables: { content: newMessage, to: openChat, from: user.email },
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
