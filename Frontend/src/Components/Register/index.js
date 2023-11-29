import React, { useState } from "react";
import { useRouter } from "next/router";
import { REGISTER_USER } from "@/GraphqlApi/Mutations/register";
import { useMutation } from "@apollo/client";
import Form from "../Form";

export const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    onError: (err) => {
      console.log(err.graphQLErrors[0].extensions.errors);
      setErrors(err.graphQLErrors[0].extensions.errors);
    },
    onCompleted: (data) => router.push("/login"),
    update: (cache, { data }) => console.log(data, "update"),
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
    registerUser({ variables: formData });
  };

  const errorColor = "text-red-600";

  return (
    <div>
      <Form
        errors={errors}
        handleOnChange={handleOnChange}
        errorColor={errorColor}
        handleSubmit={handleSubmit}
        loading={loading}
        buttonText={"Register new account"}
      />
    </div>
  );
};
