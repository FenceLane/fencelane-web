import React, { useEffect } from "react";
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
import { LoginFormData } from "../../lib/schema/loginFormData";
import { usePostLogin } from "../../lib/api/hooks/auth";
import axios from "axios";
import { useRouter } from "next/router";

export const LoginForm = () => {
  const { mutate, error, isSuccess, isLoading } = usePostLogin();
  const router = useRouter();

  const handleSubmit = (
    values: LoginFormData,
    actions: FormikHelpers<LoginFormData>
  ) => {
    mutate(values);
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [router, isSuccess]);

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
        {({ errors, touched, dirty }) => (
          <Form>
            <FormControl isInvalid={!!errors.email && touched.email} mb="15px">
              <FormLabel htmlFor="email">E-mail</FormLabel>
              <Field
                as={Input}
                id="email"
                type="email"
                name="email"
                placeholder="example@fencelane.com"
                required
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
                required
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
              {!dirty &&
                axios.isAxiosError(error) &&
                error.response?.data.label}
            </FormControl>
            <Flex justifyContent={"flex-end"}>
              <Text as={Link} href="/register" color="blue.500">
                Nie masz konta? Zarejestruj się.
              </Text>
            </Flex>
            <Center>
              <Button
                isLoading={isLoading}
                isDisabled={isLoading}
                mt="4"
                type="submit"
                colorScheme="teal"
                variant="outline"
              >
                Zaloguj się
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
