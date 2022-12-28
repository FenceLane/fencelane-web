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
import { useContent } from "../../lib/util/hooks/useContent";
import { useRouter } from "next/router";
import { usePutCompletePasswordReset } from "../../lib/api/hooks/auth";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";

const initialValues = {
  password: "",
  confirmPassword: "",
};

export const PasswordResetNewPasswordForm = () => {
  const router = useRouter();
  const { t } = useContent();

  const {
    mutate: resetPassword,
    error,
    isSuccess,
  } = usePutCompletePasswordReset();

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
      return t(
        "pages.password-reset.form.password.fields.confirmPassword.error"
      );
    }
  };

  return (
    <Box ml="auto" mr="auto" w="400px">
      <Center flexDirection="column" mb="20px">
        <Heading>{t("pages.password-reset.form.password.title")}</Heading>
        <Text>{t("pages.password-reset.form.password.description")}</Text>
      </Center>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={initialValues}
        onSubmit={(data) => resetPassword(data)}
      >
        {({ errors, touched, values }) => (
          <Form noValidate>
            <FormControl
              isInvalid={!!errors.password && touched.password}
              mb="15px"
            >
              <FormLabel htmlFor="password">
                {t("pages.password-reset.form.password.fields.password.label")}
              </FormLabel>
              <Field
                as={Input}
                id="password"
                type="password"
                name="password"
                placeholder={t(
                  "pages.password-reset.form.password.fields.password.placeholder"
                )}
              />
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!errors.confirmPassword && touched.confirmPassword}
            >
              <FormLabel htmlFor="confirmPassword">
                {t(
                  "pages.password-reset.form.password.fields.confirmPassword.label"
                )}
              </FormLabel>
              <Field
                as={Input}
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder={t(
                  "pages.password-reset.form.password.fields.confirmPassword.placeholder"
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
              <Button mt="4" type="submit" colorScheme="teal" variant="outline">
                {t("pages.password-reset.form.password.submit.label")}
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
