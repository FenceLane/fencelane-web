import React from "react";
import { Formik, Form, Field } from "formik";
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

export const RegisterForm = () => {
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
        onSubmit={(values, actions) => {
          alert(JSON.stringify(values, null, 2));
          actions.resetForm();
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <FormControl
              isInvalid={formik.errors.name != undefined && formik.touched.name}
              mb="15px"
            >
              <FormLabel htmlFor="name">Imię i nazwisko</FormLabel>
              <Field
                as={Input}
                id="name"
                name="name"
                placeholder="Jan Kowalski"
              />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                formik.errors.email != undefined && formik.touched.email
              }
              mb="15px"
            >
              <FormLabel htmlFor="email">E-mail</FormLabel>
              <Field
                as={Input}
                id="email"
                type="email"
                name="email"
                placeholder="example@fencelane.com"
              />
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                formik.errors.password != undefined && formik.touched.password
              }
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
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                formik.errors.checkPassword != undefined &&
                formik.touched.checkPassword
              }
            >
              <FormLabel htmlFor="checkPassword">Powtórz hasło</FormLabel>
              <Field
                as={Input}
                id="checkPassword"
                type="password"
                name="checkPassword"
                placeholder="Powtórz hasło"
              />
              <FormErrorMessage>{formik.errors.checkPassword}</FormErrorMessage>
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

// pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
// ^ min. 1 wielka, mala, znak, cyfr i min. 8 znakow
