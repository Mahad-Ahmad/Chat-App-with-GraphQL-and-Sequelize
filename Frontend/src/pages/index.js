import { userLoginSelector } from "@/Store/Selectors/UserSelector";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_USER, GET_USERS } from "@/GraphqlApi/Queries/Users";
import User from "@/Components/ChatBox/User";
import Message from "@/Components/ChatBox/Message";
import Input from "@/Components/ChatBox/Input";
import Chat from "@/Components/ChatBox";

export default function Home() {
  const [users, setUsers] = useState([]);

  const { loading } = useQuery(GET_USERS, {
    onCompleted: (data) => {
      const { getUsers } = data;
      setUsers(getUsers);
    },
    onError: (err) => console.log(err),
  });

  // const [getMessages, { messageLoading }] = useLazyQuery(GET_M, {
  //   onCompleted: (data) => {
  //     const { getUsers } = data;
  //     setUsers(getUsers);
  //   },
  //   onError: (err) => console.log(err),
  // });

  const onChatClick = (name) => {
    console.log(name);
  };
  const onSend = (name) => {
    console.log(name);
  };
  const onChange = (name) => {
    console.log(name);
  };
  console.log(users);

  return (
    <>
      <Chat
        users={users}
        onSend={onSend}
        onChange={onChange}
        onChatClick={onChatClick}
      />
    </>
  );
}
