import { GET_USER } from "@/GraphqlApi/Queries/Users";
import { userAtom } from "@/Store/Atoms/UserAtom";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

// components/Layout.js
const AuthLayout = ({ children }) => {
  const setUser = useSetRecoilState(userAtom);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  const { data, loading, error } = useQuery(GET_USER, {
    onCompleted: (data) => {
      localStorage.setItem("user", JSON.stringify(data.getUser));
      setUser(data.getUser);
    },
    onError: (err) => {
      setUser("");
      router.push("/login");
      toast.error(err.message);
      console.log(err.message);
    },
  });

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, [token]);

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
