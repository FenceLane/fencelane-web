import { z } from "zod";
import { i18n } from "next-i18next";

export const LoginFormDataSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginFormData = z.infer<typeof LoginFormDataSchema>;

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (!i18n) {
    return { message: ctx.defaultError };
  }

  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === "email") {
      return { message: i18n.t("pages.login.form.fields.email.error") };
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
