import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { useLazyQuery } from "@apollo/client";
import { LOGIN_USER } from "@/GraphqlApi/Queries/Login";
import { userAtom } from "@/Store/Atoms/UserAtom";
import Form from "../Form";
import { toast } from 'react-toastify';

export const Login = () => {
  const router = useRouter();
  const setUser = useSetRecoilState(userAtom);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState('');

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => {
      console.log(err.message, "err");
      toast.error(err.message)
      setError(err.message);
    },
    onCompleted: (data) => {
      const { login } = data;
      localStorage.setItem("token", JSON.stringify(login.token));
      const user = (({ token, ...rest }) => rest)(login);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      router.push("/");
    },
  });

  const handleOnChange = (field, e) => {
    setError('');
    setFormData((prev) => ({
      ...prev,
      [field]: e,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ variables: formData });
  };

  return (
    <div>
      <Form
        login
        error={error}
        handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
        loading={loading}
        buttonText={"Login"}
      />
    </div>
  );
};
