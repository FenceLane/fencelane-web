import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import {
  Box,
  Center,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";

export interface formTypes {
  name: string;
  email: string;
  password: string;
  checkPassword: string;
}

export const RegisterForm = () => {
  const handleSubmit = (
    values: formTypes,
    actions: FormikHelpers<formTypes>
  ) => {
    alert(JSON.stringify(values));
    actions.resetForm();
  };
  return (
    <Box minW="400px">
      <Center mb="20px">
        <Heading>Rejestracja</Heading>
      </Center>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          checkPassword: "",
        }}
        onSubmit={(values, actions) => handleSubmit(values, actions)}
      >
        {({ errors, touched }) => (
          <Form>
            <FormControl isInvalid={!!errors.name && touched.name} mb="15px">
              <FormLabel htmlFor="name">Imię i nazwisko</FormLabel>
              <Field
                as={Input}
                id="name"
                name="name"
                placeholder="Jan Kowalski"
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.email && touched.email} mb="15px">
              <FormLabel htmlFor="email">E-mail</FormLabel>
              <Field
                as={Input}
                id="email"
                type="email"
                name="email"
                placeholder="example@fencelane.com"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!errors.password && touched.password}
              mb="15px"
            >
              <FormLabel htmlFor="password">Hasło</FormLabel>
              <Field
                as={Input}
                id="password"
                type="password"
                name="password"
                placeholder="Wprowadź hasło"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!errors.checkPassword && touched.checkPassword}
            >
              <FormLabel htmlFor="checkPassword">Powtórz hasło</FormLabel>
              <Field
                as={Input}
                id="checkPassword"
                type="password"
                name="checkPassword"
                placeholder="Powtórz hasło"
              />
              <FormErrorMessage>{errors.checkPassword}</FormErrorMessage>
            </FormControl>
            <Center>
              <Button mt="4" type="submit" colorScheme="teal" variant="outline">
                Zarejestruj się!
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
