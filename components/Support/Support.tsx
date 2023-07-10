import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useContent } from "../../lib/hooks/useContent";

export const Support = () => {
  const { t } = useContent();
  return (
    <Box bg="white" p="20px" width="auto">
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" mb="20px">
        {t("pages.support.support")}
      </Text>
      <Text fontWeight="500">{t("pages.support.admin_contact")}:</Text>
      <Text>tel. 664 582 385</Text>
      <Text>e-mail: fencelaneapp@gmail.com</Text>
    </Box>
  );
};
