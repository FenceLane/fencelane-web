import { Text, Button, Flex, Input } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useContent } from "../../../../../lib/hooks/useContent";
import { mapAxiosErrorToLabel } from "../../../../../lib/server/BackendError/BackendError";
import { usePostClient } from "../../../../../lib/api/hooks/orders";

const initialNewClientData = {
  name: "",
  shortName: "",
  email: "",
  phone: "",
};

export const ClientCreate = () => {
  const router = useRouter();
  const { t } = useContent();

  const [clientData, setClientData] = useState(initialNewClientData);

  const {
    mutate: postClient,
    error,
    isSuccess,
    isError,
    isLoading,
  } = usePostClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData((clientData) => ({
      ...clientData,
      [name]: value,
    }));
  };

  const handlePostClient = () => {
    postClient({ data: clientData });
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/loads/create");
    }
  }, [router, isSuccess]);

  return (
    <Flex width="100%" maxWidth="980px" flexDir="column">
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" mb="20px">
        {t("pages.orders.clients.client-creator")}
      </Text>
      <label>{t("pages.orders.clients.name")}</label>
      <Input
        mb="20px"
        bg="white"
        onInput={handleChange}
        name="name"
        placeholder={t("pages.orders.clients.name")}
      />
      <label>{t("pages.orders.clients.short-name")}</label>
      <Input
        mb="20px"
        bg="white"
        onInput={handleChange}
        name="shortName"
        placeholder={t("pages.orders.clients.short-name")}
      />
      <label>E-mail</label>
      <Input
        type="email"
        mb="20px"
        bg="white"
        onInput={handleChange}
        name="email"
        placeholder="E-mail"
      />
      <label>{t("pages.orders.clients.phone-number")}</label>
      <Input
        type="number"
        bg="white"
        onInput={handleChange}
        name="phone"
        placeholder={t("pages.orders.clients.phone-number")}
      />
      <Flex justifyContent="flex-end" gap="50px" mt="20px">
        <Link href="/loads/create">
          <Button colorScheme="red">{t("buttons.cancel")}</Button>
        </Link>
        <Button
          colorScheme="green"
          isLoading={isLoading}
          onClick={handlePostClient}
        >
          {t("buttons.confirm")}
        </Button>
      </Flex>
      {isError && (
        <Text color="red" fontWeight="600" fontSize="18px">
          {t(`errors.backendErrorLabel.${mapAxiosErrorToLabel(error)}`)}
        </Text>
      )}
    </Flex>
  );
};
