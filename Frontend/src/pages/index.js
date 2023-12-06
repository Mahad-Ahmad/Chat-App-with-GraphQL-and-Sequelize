import { userLoginSelector } from "@/Store/Selectors/UserSelector";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER, GET_USERS } from "@/GraphqlApi/Queries/Users";

export default function Home() {
  // const { data, loading, error } = useQuery(GET_USERS, {
  //   onCompleted: (data) => console.log(data),
  //   onError: (err) => console.log(err),
  // });

  const { data, loading, error } = useQuery(GET_USER, {
    onCompleted: (data) => console.log(data),
    onError: (err) => {
      console.log(err.graphQLErrors[0]);
      // setErrors(err.graphQLErrors[0].extensions.errors);
    }
  });
  return <div>Home</div>;
}
