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
import { useContent } from "../../lib/hooks/useContent";
import { useRouter } from "next/router";
import { usePostRegister } from "../../lib/api/hooks/auth";
import { RegisterFormDataSchema } from "../../lib/schema/registerFormData";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";

const registerInitialValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
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

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    if (password !== confirmPassword) {
      return t("pages.register.form.fields.confirmPassword.error");
    }
  };

  return (
    <Box mr="auto" ml="auto" mt="20px" w="100%" maxW="400px">
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
        {({ errors, touched, values }) => (
          <Form noValidate>
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
            <FormControl isInvalid={!!errors.phone && touched.phone} mb="15px">
              <FormLabel htmlFor="phone">
                {t("pages.register.form.fields.phone.label")}
              </FormLabel>
              <Field
                as={Input}
                id="phone"
                type="tel"
                name="phone"
                placeholder={t("pages.register.form.fields.phone.placeholder")}
              />
              <FormErrorMessage>{errors.phone}</FormErrorMessage>
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
              isInvalid={!!errors.confirmPassword && touched.confirmPassword}
            >
              <FormLabel htmlFor="confirmPassword">
                {t("pages.register.form.fields.confirmPassword.label")}
              </FormLabel>
              <Field
                as={Input}
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder={t(
                  "pages.register.form.fields.confirmPassword.placeholder"
                )}
                validate={(value: string) =>
                  validateConfirmPassword(values.password, value)
                }
              />
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
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
