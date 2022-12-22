import React, { useEffect } from "react";
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
import { LoginFormDataSchema } from "../../lib/schema/loginFormData";
import { usePostLogin } from "../../lib/api/hooks/auth";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useContent } from "../../lib/util/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";

const initialValies = {
  email: "",
  password: "",
};

export const LoginForm = () => {
  const router = useRouter();
  const { t } = useContent();

  const { mutate: login, error, isSuccess, isLoading } = usePostLogin();

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [router, isSuccess]);

  return (
    <Box mr="auto" ml="auto" mt="100px" w="400px">
      <Center mb="20px">
        <Heading>{t("pages.login.title")}</Heading>
      </Center>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={toFormikValidationSchema(LoginFormDataSchema)}
        initialValues={initialValies}
        onSubmit={(data) => login(data)}
      >
        {({ errors, touched, setErrors }) => (
          <Form noValidate>
            <FormControl isInvalid={!!errors.email && touched.email} mb="15px">
              <FormLabel htmlFor="email">
                {t("pages.login.form.fields.email.label")}
              </FormLabel>
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
              <FormLabel htmlFor="password">
                {t("pages.login.form.fields.password.label")}
              </FormLabel>
              <Field
                as={Input}
                id="password"
                type="password"
                name="password"
                placeholder="Wprowadź hasło"
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={touched && !!error} mb="15px">
              <FormErrorMessage>
                {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)}
              </FormErrorMessage>
            </FormControl>

            <Center>
              <Button
                isLoading={isLoading}
                isDisabled={isLoading}
                mt="4"
                type="submit"
                colorScheme="teal"
                variant="outline"
              >
                {t("pages.login.form.submit.label")}
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
      <Flex justifyContent={"flex-end"}>
        <Text as={Link} href="/register" color="blue.500">
          {t("pages.login.noAccount")}
        </Text>
      </Flex>
    </Box>
  );
};
