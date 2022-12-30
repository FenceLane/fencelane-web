import React, { useState } from "react";
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
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";
import { apiClient } from "../../lib/api/apiClient";
import { toastError, toastInfo } from "../../lib/util/toasts";
import Link from "next/link";

const initialValues = {
  password: "",
  confirmPassword: "",
};

export const PasswordResetNewPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useContent();

  const passwordResetToken = router.query.token;

  const handleSubmit = ({
    password,
  }: {
    password: string;
    confirmPassword: string;
  }) => {
    if (typeof passwordResetToken !== "string") {
      return router.push("/password-reset");
    }
    setIsLoading(true);
    apiClient.auth
      .putCompletePasswordReset({ password, token: passwordResetToken })
      .then(() => {
        toastInfo(t("success.password-reset-complete"));
        router.push("/login");
      })
      .catch((error) => {
        toastError(
          t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)
        );
      })
      .finally(() => setIsLoading(false));
  };

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

  const validateRequiredField = (value: string) => {
    if (!value) {
      return t("errors.form.fieldRequired");
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
        onSubmit={handleSubmit}
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
                validate={validateRequiredField}
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
                required
                validate={(value: string) =>
                  validateConfirmPassword(values.password, value)
                }
              />
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>

            <Center>
              <Button
                isDisabled={isLoading}
                isLoading={isLoading}
                mt="4"
                type="submit"
                colorScheme="teal"
                variant="outline"
              >
                {t("pages.password-reset.form.password.submit.label")}
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
      <Text as={Link} href="/password-reset" color="blue.500">
        {t("pages.password-reset.resendMail")}
      </Text>
    </Box>
  );
};
