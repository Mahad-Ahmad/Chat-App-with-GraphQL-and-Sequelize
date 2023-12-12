import React, { useState } from "react";
import { useRouter } from "next/router";
import { REGISTER_USER } from "@/GraphqlApi/Mutations/register";
import { useMutation } from "@apollo/client";
import Form from "../Form";
import { toast } from "react-toastify";

export const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState('');

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    onError: (err) => {
      console.log(err.message);
      toast.error(err.message);
      setError(err.message);
    },
    onCompleted: (data) => router.push("/login"),
    update: (cache, { data }) => console.log(data, "update"),
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
    registerUser({ variables: formData });
  };

  return (
    <div>
      <Form
        error={error}
        handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
        loading={loading}
        buttonText={"Register new account"}
      />
    </div>
  );
};
