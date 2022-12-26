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
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useContent } from "../../lib/util/hooks/useContent";

export interface FormTypes {
  name: string;
  email: string;
  password: string;
  checkPassword: string;
}

const registerInitialValues = {
  name: "",
  email: "",
  password: "",
  checkPassword: "",
};

export const RegisterForm = () => {
  const { t } = useContent();

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
        <Heading>{t("pages.register.form.title")}</Heading>
      </Center>
      <Formik initialValues={registerInitialValues} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form>
            <FormControl isInvalid={!!errors.name && touched.name} mb="15px">
              <FormLabel htmlFor="name">
                {t("pages.register.form.fields.name.label")}
              </FormLabel>
              <Field
                as={Input}
                id="name"
                name="name"
                placeholder={t("pages.register.form.fields.name.placeholder")}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.email && touched.email} mb="15px">
              <FormLabel htmlFor="email">
                {t("pages.register.form.fields.email.label")}
              </FormLabel>
              <Field
                as={Input}
                id="email"
                type="email"
                name="email"
                placeholder={t("pages.register.form.fields.email.placeholder")}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!errors.password && touched.password}
              mb="15px"
            >
              <FormLabel htmlFor="password">
                {t("pages.register.form.fields.password.label")}
              </FormLabel>
              <Field
                as={Input}
                id="password"
                type="password"
                name="password"
                placeholder={t(
                  "pages.register.form.fields.password.placeholder"
                )}
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!errors.checkPassword && touched.checkPassword}
            >
              <FormLabel htmlFor="checkPassword">
                {t("pages.register.form.fields.repeatPassword.label")}
              </FormLabel>
              <Field
                as={Input}
                id="checkPassword"
                type="password"
                name="checkPassword"
                placeholder={t(
                  "pages.register.form.fields.repeatPassword.placeholder"
                )}
              />
              <FormErrorMessage>{errors.checkPassword}</FormErrorMessage>
            </FormControl>
            <Center>
              <Button mt="4" type="submit" colorScheme="teal" variant="outline">
                {t("pages.register.form.submit")}
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
      <Text as={Link} href="/login" color="blue.500">
        {t("pages.register.hasAccount")}
      </Text>
    </Box>
  );
};
