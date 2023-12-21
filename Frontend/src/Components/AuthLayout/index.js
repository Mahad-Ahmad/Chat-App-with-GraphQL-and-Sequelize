import { GET_USER } from "@/GraphqlApi/Queries/Users";
import { userAtom } from "@/Store/Atoms/UserAtom";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

// components/Layout.js
const AuthLayout = ({ children }) => {
  const [user, setUser] = useRecoilState(userAtom);
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_USER, {
    onCompleted: (data) => {
      console.log(data);
      // localStorage.setItem("token", JSON.stringify(login.token));
      // const user = (({ token, ...rest }) => rest)(login);
      // localStorage.setItem("user", JSON.stringify(user));
      // setUser(user);
    },
    onError: (err) => {
      router.push("/login");
      console.log(err.graphQLErrors[0]);
    },
  });

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
