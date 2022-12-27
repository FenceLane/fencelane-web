import { toast } from "react-toastify";

export const toastError = (content: string) => {
  return toast(content, { type: "error" });
};

export const toastSuccess = (content: string) => {
  return toast(content, { type: "success" });
};

export const toastInfo = (content: string) => {
  return toast(content, { type: "info" });
};
