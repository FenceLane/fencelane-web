import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Layout } from "../../components/Layout/Layout";
import { PasswordResetEmailForm } from "../../components/PasswordResetEmailForm/PasswordResetEmailForm";
import { PasswordResetNewPasswordForm } from "../../components/PasswordResetNewPasswordForm/PasswordResetNewPasswordForm";
import { withTranslationProps } from "../../lib/server/middlewares/withTranslationProps";
import { useContent } from "../../lib/hooks/useContent";

const LoginPage = () => {
  const { t } = useContent("pages.password-reset");
  const router = useRouter();

  const passwordResetToken = router.query.token;

  return (
    <Layout title={t("title")} hideSidebar>
      {passwordResetToken ? (
        <PasswordResetNewPasswordForm />
      ) : (
        <PasswordResetEmailForm />
      )}
    </Layout>
  );
};

export default LoginPage;

export const getServerSideProps = withTranslationProps(async ({ req }) => {
  const sessionId = req.cookies.authorization;
  if (sessionId) {
    return {
      redirect: {
        permanent: true,
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
});
