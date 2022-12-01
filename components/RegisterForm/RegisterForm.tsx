import React, { useState } from "react";
import {
  Box,
  Center,
  Flex,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";

interface RegisterFormProps {
  name?: string;
}

export const RegisterForm = ({}: RegisterFormProps) => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    checkPassword: "",
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(inputs.password === inputs.checkPassword);
  };
  return (
    <Box>
      <Center>
        <Heading>Formularz rejestracji</Heading>
      </Center>
      <form onSubmit={handleSubmit}>
        <Flex flexDirection="column" gap={5}>
          <FormControl isRequired>
            <FormLabel>Imię i nazwisko</FormLabel>
            <Input
              type="text"
              id="name"
              name="name"
              // pattern="[A-Z][a-z]+ [A-Z][a-z]*"
              // minLength={6}
              // maxLength={32}
              onChange={handleChange}
            />
            <FormErrorMessage>Wprowadź imię i nazwisko.</FormErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>E-mail</FormLabel>
            <Input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
            />

            <FormErrorMessage>Wprowadź E-mail.</FormErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Hasło</FormLabel>
            <Input
              type="password"
              id="password"
              name="password"
              // pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
              // minLength={8}
              onChange={handleChange}
            />
            <FormErrorMessage>Wprowadź hasło.</FormErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Powtórz hasło</FormLabel>
            <Input
              type="password"
              id="confirmPassword"
              name="checkPassword"
              onChange={handleChange}
            />
            <FormErrorMessage>Hasła się nie zgadzają.</FormErrorMessage>
          </FormControl>
          <Button type="submit" colorScheme="teal" variant="outline">
            Zarejestruj się!
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
