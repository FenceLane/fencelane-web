import { useTranslation } from "next-i18next";
import { useCallback } from "react";

export const useContent = (parentSelector: string) => {
  const { t } = useTranslation("common");

  const pageTranslation = useCallback(
    (field: string) => t(`${parentSelector}.${field}`),
    [parentSelector, t]
  );

  return { t: pageTranslation };
};
