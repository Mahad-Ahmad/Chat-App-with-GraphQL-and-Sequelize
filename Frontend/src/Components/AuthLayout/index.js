import { GET_USER } from "@/GraphqlApi/Queries/Users";
import { userAtom } from "@/Store/Atoms/UserAtom";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

// components/Layout.js
const AuthLayout = ({ children }) => {
  const setUser = useSetRecoilState(userAtom);
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_USER, {
    onCompleted: (data) => {
      localStorage.setItem("user", JSON.stringify(data.getUser));
      setUser(data.getUser);
    },
    onError: (err) => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser("");
      router.push("/login");
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && data) {
      router.push("/");
    } else if (error || !token) {
      router.push("/login");
    }
  }, [data, loading, error]);

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
