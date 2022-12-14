import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
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

export interface FormTypes {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const handleSubmit = (
    values: FormTypes,
    actions: FormikHelpers<FormTypes>
  ) => {
    alert(JSON.stringify(values));
    actions.resetForm();
  };
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
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
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
