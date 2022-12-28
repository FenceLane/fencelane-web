import React from "react";
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
import { toFormikValidationSchema } from "zod-formik-adapter";
import { PasswordResetFormEmailDataSchema } from "../../lib/schema/passwordResetFormEmailData";
import { apiClient } from "../../lib/api/apiClient";
import { toastError, toastInfo } from "../../lib/util/toasts";
import { mapAxiosErrorToLabel } from "../../lib/server/BackendError/BackendError";

const initialValues = {
  email: "",
};

export const PasswordResetEmailForm = () => {
  const { t } = useContent();

  const initialisePasswordResetFlow = (data: { email: string }) => {
    apiClient.auth
      .postInitialisePasswordReset(data)
      .then(() => toastInfo(t("success.password-reset-email-sent")))
      .catch((error) => {
        toastError(
          t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)
        );
      });
  };

  return (
    <Box ml="auto" mr="auto" w="400px">
      <Center flexDirection="column" mb="20px">
        <Heading>{t("pages.password-reset.form.email.title")}</Heading>
        <Text>{t("pages.password-reset.form.email.description")}</Text>
      </Center>
      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={toFormikValidationSchema(
          PasswordResetFormEmailDataSchema
        )}
        initialValues={initialValues}
        onSubmit={initialisePasswordResetFlow}
      >
        {({ errors, touched }) => (
          <Form noValidate>
            <FormControl isInvalid={!!errors.email && touched.email} mb="15px">
              <FormLabel htmlFor="email">
                {t("pages.password-reset.form.email.fields.email.label")}
              </FormLabel>
              <Field
                as={Input}
                id="email"
                type="email"
                name="email"
                placeholder={t(
                  "pages.password-reset.form.email.fields.email.placeholder"
                )}
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <Center>
              <Button mt="4" type="submit" colorScheme="teal" variant="outline">
                {t("pages.password-reset.form.email.submit.label")}
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
