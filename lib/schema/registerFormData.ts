import { z } from "zod";
import { i18n } from "next-i18next";

export const RegisterFormDataSchema = z.object({
  name: z.string(),
  phone: z.string().regex(/^\+?[0-9 ]+/),
  role: z.number().optional(),
  email: z.string().email(),
  password: z.string(),
});

export type RegisterFormData = z.infer<typeof RegisterFormDataSchema>;

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (!i18n) {
    return { message: ctx.defaultError };
  }

  console.log(issue);

  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === "email") {
      return { message: i18n.t("pages.register.form.fields.email.error") };
    }
    if (issue.validation === "regex") {
      return { message: i18n.t("errors.form.regex") };
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
