import React from "react";
import { Formik, Form, Field } from "formik";
import {
  Box,
  Flex,
  Center,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

interface LoginFormProps {
  name?: string;
}

export const LoginForm = ({ name }: LoginFormProps) => {
  return (
    <Box minW="400px">
      <Center mb="20px">
        <Heading>Logowanie</Heading>
      </Center>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(values, actions) => {
          alert(JSON.stringify(values, null, 2));
          actions.resetForm();
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
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
            <Flex justifyContent={"flex-end"}>
              <Text as={Link} href="/register" color="blue.500">
                Nie masz konta? Zarejestruj się.
              </Text>
            </Flex>
            <Center>
              <Button mt="4" type="submit" colorScheme="teal" variant="outline">
                Zaloguj się
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
