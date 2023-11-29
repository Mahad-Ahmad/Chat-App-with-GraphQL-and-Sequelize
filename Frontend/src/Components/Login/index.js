import React, { useState } from "react";
import { useRouter } from "next/router";
import { useLazyQuery } from "@apollo/client";
import { LOGIN_USER } from "@/GraphqlApi/Queries/Login";
import Form from "../Form";

export const Login = () => {
  const router = useRouter();

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
    onCompleted: (data) => {
      localStorage.setItem("token", data.login.token);
      router.push('/')
    },
  });

  const handleOnChange = (field, e) => {
    setErrors({})
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
