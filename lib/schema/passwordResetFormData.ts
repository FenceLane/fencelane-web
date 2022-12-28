import { z } from "zod";
import { i18n } from "next-i18next";

export const PasswordResetFormDataSchema = z.object({
  email: z.string().email(),
});

export type PasswordResetFormData = z.infer<typeof PasswordResetFormDataSchema>;

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (!i18n) {
    return { message: ctx.defaultError };
  }

  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === "email") {
      return {
        message: i18n.t("pages.password-reset.form.email.fields.email.error"),
      };
    }
  }

  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.received === "undefined") {
      return { message: i18n.t("errors.form.fieldRequired") };
    }
  }

  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);
