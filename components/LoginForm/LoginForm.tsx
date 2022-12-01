import React from "react";
import { Input } from "@chakra-ui/react";

interface LoginFormProps {
  name?: string;
}

export const LoginForm = ({ name }: LoginFormProps) => {
  return (
    <div>
      <Input placeholder="E-mail" />
      <Input placeholder="Hasło" />
    </div>
  );
};
