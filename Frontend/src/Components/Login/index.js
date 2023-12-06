import React, { useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { useLazyQuery } from "@apollo/client";
import { LOGIN_USER } from "@/GraphqlApi/Queries/Login";
import { userAtom } from "@/Store/Atoms/UserAtom";
import Form from "../Form";

export const Login = () => {
  const router = useRouter();
  const setUser = useSetRecoilState(userAtom);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const [loginUser, { loading }] = useLazyQuery(LOGIN_USER, {
    onError: (err) => {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted: ({ login }) => {
      console.log(login, 'har bar chalna chiay');
      setUser(login);
      localStorage.setItem("user", JSON.stringify(login));
      router.push("/");
    },
  });

  const handleOnChange = (field, e) => {
    setErrors({});
    setFormData((prev) => ({
      ...prev,
      [field]: e,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser({ variables: formData });
  };

  const errorColor = "text-red-600";

  return (
    <div>
      <Form
        login
        errors={errors}
        handleOnChange={handleOnChange}
        errorColor={errorColor}
        handleSubmit={handleSubmit}
        loading={loading}
        buttonText={"Login"}
      />
    </div>
  );
};
