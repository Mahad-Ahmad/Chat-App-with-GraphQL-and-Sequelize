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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
    } else {
      router.push("/login");
    }
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

  return (
    <div>
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;
