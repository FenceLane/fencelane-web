import React, { useEffect, useState } from "react";
import { usePostDestination } from "../../../../../../lib/api/hooks/orders";
import { useContent } from "../../../../../../lib/hooks/useContent";
import { useRouter } from "next/router";

import { Text, Button, Flex, Input, Select } from "@chakra-ui/react";
import Link from "next/link";
import { mapAxiosErrorToLabel } from "../../../../../../lib/server/BackendError/BackendError";

interface DestinationCreateProps {
  clients: {
    destinations: {
      id: string;
      country: string;
      address: string;
      postalCode: string;
      city: string;
      clientId: string;
    }[];
    id: string;
    name: string;
    shortName: string;
    email: string;
    phone: string;
  }[];
}

const initialDestinationData = {
  country: "",
  address: "",
  postalCode: "",
  city: "",
};

export const DestinationCreate = ({ clients }: DestinationCreateProps) => {
  const router = useRouter();
  const { t } = useContent();

  const [destinationData, setDestinationData] = useState(
    initialDestinationData
  );
  const [clientId, setClientId] = useState<string | null>(null);

  const {
    mutate: postDestination,
    error,
    isSuccess,
    isError,
    isLoading,
  } = usePostDestination();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setDestinationData((destinationData) => ({
      ...destinationData,
      [name]: value,
    }));
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClientId(e.target.value);
  };

  const handlePostDestination = () => {
    postDestination({ id: clientId as string, data: destinationData });
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/loads/create");
    }
  }, [router, isSuccess]);

  return (
    <Flex width="100%" maxWidth="980px" flexDir="column">
      <Text color="var(--dark)" fontSize="20px" fontWeight="500" mb="20px">
        {t("pages.orders.destinations.destination-creator")}
      </Text>
      <label>{t("main.client")}</label>
      <Select
        required
        bg="white"
        mb="20px"
        name="clientId"
        onChange={handleClientChange}
        placeholder={t("main.client")}
      >
        {clients.map((client) => (
          <option value={client.id} key={client.id}>
            {client.name}
          </option>
        ))}
      </Select>

      <label>{t("pages.orders.destinations.address")}</label>
      <Input
        mb="20px"
        bg="white"
        onInput={handleChange}
        name="address"
        placeholder={t("pages.orders.destinations.address")}
      />
      <label>{t("pages.orders.destinations.postal-code")}</label>
      <Input
        mb="20px"
        bg="white"
        onInput={handleChange}
        name="postalCode"
        placeholder={t("pages.orders.destinations.postal-code")}
      />
      <label>{t("pages.orders.destinations.city")}</label>
      <Input
        mb="20px"
        bg="white"
        onInput={handleChange}
        name="city"
        placeholder={t("pages.orders.destinations.city")}
      />
      <label>{t("pages.orders.destinations.country")}</label>
      <Input
        mb="20px"
        bg="white"
        onInput={handleChange}
        name="country"
        placeholder={t("pages.orders.destinations.country")}
      />
      <Flex justifyContent="flex-end" gap="50px" mt="20px">
        <Link href="/loads/create">
          <Button colorScheme="red">{t("buttons.cancel")}</Button>
        </Link>
        <Button
          colorScheme="green"
          isLoading={isLoading}
          onClick={handlePostDestination}
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
