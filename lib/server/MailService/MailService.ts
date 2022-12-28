import sgMail from "@sendgrid/mail";

const initSgMailClient = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    throw new Error("SENDGRID_API_KEY env variable was not provided");
  }
  sgMail.setApiKey(apiKey);
  return sgMail;
};

const mailClient = initSgMailClient();

interface SendProps {
  passwordResetUrl: string;
  to: string;
}

const sendPasswordReset = ({ passwordResetUrl, to }: SendProps) => {
  const message: sgMail.MailDataRequired = {
    to,
    from: "fencelaneapp@gmail.com",
    templateId: "d-94817876f8b94cd79f3223a0dd03621d",
    dynamicTemplateData: { button_url: passwordResetUrl },
  };

  return mailClient.send(message);
};

export const mailService = { sendPasswordReset };
