import React, { useEffect } from "react";
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
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useContent } from "../../lib/util/hooks/useContent";
import { useRouter } from "next/router";
import { usePostRegister } from "../../lib/api/hooks/auth";
import { RegisterFormDataSchema } from "../../lib/schema/registerFormData";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";

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
  const router = useRouter();
  const { t } = useContent();

  const { mutate: register, error, isSuccess, isLoading } = usePostRegister();

  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [router, isSuccess]);

  return (
    <Box minW="400px">
      <Center mb="20px">
        <Heading>{t("pages.register.form.title")}</Heading>
      </Center>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={toFormikValidationSchema(RegisterFormDataSchema)}
        initialValues={registerInitialValues}
        onSubmit={(data) => register(data)}
      >
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

            <FormControl isInvalid={touched && !!error} mb="15px">
              <FormErrorMessage>
                {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)}
              </FormErrorMessage>
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
