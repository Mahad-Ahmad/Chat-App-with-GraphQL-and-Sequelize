import Link from "next/link";
import React from "react";
import Button from "../Button";
import Input from "./Input";
import Label from "./Label";

const Form = ({
  errors,
  handleOnChange,
  errorColor,
  handleSubmit,
  loading,
  buttonText,
  login,
}) => {
  return (
    <form className="max-w-sm mx-auto">
      <div className="mb-5">
        <Label
          errorColor={errorColor}
          errors={errors?.email}
          labelText={"Email Address"}
        />
        <Input handleOnChange={handleOnChange} type={"email"} id={"email"} />
      </div>
      {!login && (
        <div className="mb-5">
          <Label
            errorColor={errorColor}
            errors={errors?.name}
            labelText={"Name"}
          />
          <Input handleOnChange={handleOnChange} type={"text"} id={"name"} />
        </div>
      )}
      <div className="mb-5">
        <Label
          errorColor={errorColor}
          errors={errors?.password}
          labelText={"Your password"}
        />
        <Input
          handleOnChange={handleOnChange}
          type={"password"}
          id={"password"}
        />
      </div>
      {!login && (
        <div className="mb-5">
          <Label
            errorColor={errorColor}
            errors={errors?.confirmPassword}
            labelText={"Repeat password"}
          />
          <Input
            handleOnChange={handleOnChange}
            type={"password"}
            id={"confirmPassword"}
          />
        </div>
      )}
      {errors.user && (
        <div className="text-center">
          <Label
            errorColor={errorColor}
            errors={errors?.user}
          />
        </div>
      )}
      <div className="flex justify-center">
        <Button
          loading={loading}
          buttonText={buttonText}
          handleSubmit={handleSubmit}
        />
      </div>
      <div className="my-5 text-center">
        <h1>
          {login ? "Don't have an account" : "Already have an account?"}
          <Link
            href={login ? "/register" : "/login"}
            className="ml-1 text-blue-500"
          >
            {login ? "Register" : "Login"}
          </Link>
        </h1>
      </div>
    </form>
  );
};

export default Form;
