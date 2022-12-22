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
  const { t } = useContent("pages.register.form");

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
        <Heading>{t("title")}</Heading>
      </Center>
      <Formik initialValues={registerInitialValues} onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form>
            <FormControl isInvalid={!!errors.name && touched.name} mb="15px">
              <FormLabel htmlFor="name">{t("fields.name.label")}</FormLabel>
              <Field
                as={Input}
                id="name"
                name="name"
                placeholder={t("fields.name.placeholder")}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.email && touched.email} mb="15px">
              <FormLabel htmlFor="email">{t("fields.email.label")}</FormLabel>
              <Field
                as={Input}
                id="email"
                type="email"
                name="email"
                placeholder={t("fields.email.placeholder")}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!errors.password && touched.password}
              mb="15px"
            >
              <FormLabel htmlFor="password">
                {t("fields.password.label")}
              </FormLabel>
              <Field
                as={Input}
                id="password"
                type="password"
                name="password"
                placeholder={t("fields.password.placeholder")}
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!errors.checkPassword && touched.checkPassword}
            >
              <FormLabel htmlFor="checkPassword">
                {t("fields.repeatPassword.label")}
              </FormLabel>
              <Field
                as={Input}
                id="checkPassword"
                type="password"
                name="checkPassword"
                placeholder={t("fields.repeatPassword.placeholder")}
              />
              <FormErrorMessage>{errors.checkPassword}</FormErrorMessage>
            </FormControl>
            <Center>
              <Button mt="4" type="submit" colorScheme="teal" variant="outline">
                {t("submit")}
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
