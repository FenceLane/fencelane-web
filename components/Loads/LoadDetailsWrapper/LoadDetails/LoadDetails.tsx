import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Text,
  Heading,
  Button,
  Select,
  Table,
  Tr,
  Th,
  Td,
  IconButton,
  Link,
  useDisclosure,
  Thead,
  Tbody,
  Input,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { useContent } from "../../../../lib/hooks/useContent";
import {
  ExpansesInfo,
  OrderInfo,
  OrderProductInfo,
  QUANTITY_TYPE,
  TransportInfo,
} from "../../../../lib/types";
import { ChangeStatusModal } from "./ChangeStatusModal/ChangeStatusModal";
import styles from "./LoadDetails.module.scss";
import {
  useUpdateOrder,
  useUpdateOrderProducts,
} from "../../../../lib/api/hooks/orders";
import { mapAxiosErrorToLabel } from "../../../../lib/server/BackendError/BackendError";
import { constructLoadDate } from "../../../../lib/util/dateUtils";
import { InvalidValueModalText } from "./InvalidValueModalText/InvalidValueModalText";

interface LoadDetailsProps {
  loadData: OrderInfo;
  expanses: ExpansesInfo | null;
  transportCost: TransportInfo | null;
}

const statusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "var(--status-delivered)";
    default:
      return "var(--status)";
  }
};

export const LoadDetails = ({
  loadData,
  expanses,
  transportCost,
}: LoadDetailsProps) => {
  const {
    isOpen: isQuantityConfirmOpen,
    onOpen: onQuantityConfirmOpen,
    onClose: onQuantityConfirmClose,
  } = useDisclosure(); // do modala potwierdzajacego korektę invalid value

  const {
    mutate: updateLoad,
    error: updateLoadError,
    isError: isUpdateLoadError,
    isSuccess: isUpdateLoadSuccess,
    isLoading: isUpdateLoadLoading,
  } = useUpdateOrder(loadData.id); // aktualizowanie loadu (profitu)

  const cancelRef = React.useRef(null);

  const { t } = useContent();

  const [specType, setSpecType] = useState(QUANTITY_TYPE.PIECES);

  const { profit } = loadData;

  const initialNewProductDetails = loadData.products.map((product) => ({
    productOrderId: product.productOrderId,
    quantity: product.quantity * product.product.itemsPerPackage,
    price:
      (Number(product.price) * Number(product.product.volumePerPackage)) /
      product.product.itemsPerPackage,
  })); // domyslne dane do zmiany ilosci i ceny (w pieces)

  const [newProductDetails, setNewProductDetails] = useState(
    initialNewProductDetails
  ); // dane do zmiany ilosci i ceny produktow w zamowieniu

  const {
    isOpen: isStatusChangeOpen,
    onOpen: onStatusChangeOpen,
    onClose: onStatusChangeClose,
  } = useDisclosure(); // do modalu do zmiany statusu

  const id = loadData.id.toString().padStart(4, "0");

  const currentStatus =
    loadData.statusHistory[loadData.statusHistory.length - 1].status; //branie ostatniego statusu jako obecnego

  const specTableContent = loadData.products.map((product) => {
    switch (specType) {
      case QUANTITY_TYPE.PIECES:
        return {
          productName: product.product.category.name,
          productVariant: product.product.variant,
          productDimensions: product.product.dimensions,
          productQuantity: product.quantity * product.product.itemsPerPackage,
          productPrice:
            (Number(product.price) * Number(product.product.volumePerPackage)) /
            product.product.itemsPerPackage,
        };
      case QUANTITY_TYPE.PACKAGES:
        return {
          productName: product.product.category.name,
          productVariant: product.product.variant,
          productDimensions: product.product.dimensions,
          productQuantity: product.quantity,
          productPrice:
            Number(product.price) * Number(product.product.volumePerPackage),
        };
      case QUANTITY_TYPE.M3:
        return {
          productName: product.product.category.name,
          productVariant: product.product.variant,
          productDimensions: product.product.dimensions,
          productQuantity:
            product.quantity * Number(product.product.volumePerPackage),
          productPrice: Number(product.price),
        };
    }
  }); // zawartosc spec table

  const handleQuantityTypeChange = (quantityType: QUANTITY_TYPE) => {
    setSpecType(quantityType);
    setNewProductDetails(
      loadData.products.map((product) => {
        switch (quantityType) {
          case QUANTITY_TYPE.PIECES:
            return {
              productOrderId: product.productOrderId,
              quantity: product.quantity * product.product.itemsPerPackage,
              price:
                (Number(product.price) *
                  Number(product.product.volumePerPackage)) /
                product.product.itemsPerPackage,
            };
          case QUANTITY_TYPE.PACKAGES:
            return {
              productOrderId: product.productOrderId,
              quantity: product.quantity,
              price:
                Number(product.price) *
                Number(product.product.volumePerPackage),
            };
          case QUANTITY_TYPE.M3:
            return {
              productOrderId: product.productOrderId,
              quantity:
                product.quantity * Number(product.product.volumePerPackage),
              price: Number(product.price),
            };
        }
      })
    );
  }; // zmiana  rodzaju wyświetlania tabeli i wartości do updateu

  const handleSpecValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: number
  ) => {
    const {
      dataset: { column },
      value,
    } = e.target;
    const formattedValue = value.replace(/,/g, ".");
    const updatedNewProductDetails = [...newProductDetails];
    updatedNewProductDetails[key] = {
      ...updatedNewProductDetails[key],
      [column!]: Number(formattedValue),
    };
    setNewProductDetails(updatedNewProductDetails);
  }; // zmiana wartosci w tabeli, ktora aktualizuje ten stan z produktami do wyslania

  const handleUpdateSuccess = (loadProducts: Partial<OrderProductInfo>[]) => {
    if (expanses && transportCost) {
      const productLoadIds = Object.keys(expanses);

      const products = Object.assign(
        {},
        ...loadProducts.map((product, key) => ({
          [product.productOrderId!]: {
            price: product.price,
            quantity: product.quantity,
            totalCost:
              Number(loadData.products[key].product.volumePerPackage) *
              (product.quantity || 0) *
              Number(product.price),
          },
        }))
      );

      const expansesPerProduct = productLoadIds.map((productLoadId: string) => {
        return (
          Number(products[productLoadId].quantity) *
          expanses[productLoadId]
            .map((currentExpanse) => currentExpanse.price)
            .reduce((acc: number, price: string) => acc + Number(price), 0)
        );
      });
      const totalExpanses = expansesPerProduct.reduce((a, b) => a + b, 0);
      const totalClientCost = Object.values(products).reduce(
        (sum: number, product: typeof products) =>
          sum + Number(product.totalCost),
        0
      );
      const newProfit = (totalClientCost -
        totalExpanses -
        Number(transportCost.price)) as number;

      updateLoad({ profit: newProfit });
      console.log(newProfit);
    }
  }; // success

  const {
    mutate: updateLoadProducts,
    error: updateLoadProductsError,
    isError: isUpdateLoadProductsError,
    isSuccess: isUpdateLoadProductsSuccess,
    isLoading: isUpdateLoadProductsLoading,
  } = useUpdateOrderProducts(loadData.id, handleUpdateSuccess);

  const handleInvalidQuantity = () => {
    const calculatedNewProductDetails = newProductDetails.map(
      (product, key) => {
        switch (specType) {
          case QUANTITY_TYPE.PIECES:
            return {
              productOrderId: product.productOrderId,
              quantity: Math.floor(
                product.quantity /
                  loadData.products[key].product.itemsPerPackage
              ),
              price: String(
                (Number(product.price) *
                  loadData.products[key].product.itemsPerPackage) /
                  Number(loadData.products[key].product.volumePerPackage)
              ),
            };
          case QUANTITY_TYPE.PACKAGES:
            return {
              productOrderId: product.productOrderId,
              quantity: Math.floor(product.quantity),
              price: String(
                Number(product.price) /
                  Number(loadData.products[key].product.volumePerPackage)
              ),
            };
          case QUANTITY_TYPE.M3:
            return {
              productOrderId: product.productOrderId,
              quantity: Math.floor(
                product.quantity /
                  Number(loadData.products[key].product.volumePerPackage)
              ),
              price: String(product.price),
            };
        }
      }
    ); // zamiana wszystkich ilosci na paczki i cen za metr (tak sa trzymane w bazie)
    updateLoadProducts(calculatedNewProductDetails);
  }; // aktualizowanie ilosci i cen gdy pojawila sie bledna ilosc paczek

  const handleUpdateProductDetails = () => {
    const calculatedNewProductDetails = newProductDetails.map(
      (product, key) => {
        switch (specType) {
          case QUANTITY_TYPE.PIECES:
            return {
              productOrderId: product.productOrderId,
              quantity:
                product.quantity /
                loadData.products[key].product.itemsPerPackage,
              price: String(
                (Number(product.price) *
                  loadData.products[key].product.itemsPerPackage) /
                  Number(loadData.products[key].product.volumePerPackage)
              ),
            };
          case QUANTITY_TYPE.PACKAGES:
            return {
              productOrderId: product.productOrderId,
              quantity: product.quantity,
              price: String(
                Number(product.price) /
                  Number(loadData.products[key].product.volumePerPackage)
              ),
            };
          case QUANTITY_TYPE.M3:
            return {
              productOrderId: product.productOrderId,
              quantity:
                product.quantity /
                Number(loadData.products[key].product.volumePerPackage),
              price: String(product.price),
            };
        }
      }
    ); // zamiana ilosci na paczki i cen na za metr
    let invalidValue = false;
    calculatedNewProductDetails.map((product, key) => {
      if (product.quantity !== Math.floor(product.quantity)) {
        invalidValue = true;
      }
    }); //sprawdzanie czy są błędne ilości
    if (invalidValue) {
      onQuantityConfirmOpen();
    } else {
      updateLoadProducts(calculatedNewProductDetails);
    }
  }; // aktualizowanie ilosci i cen produktow

  return (
    <Flex flexDir="column" alignItems="center" minHeight="100vh">
      <Flex className={styles.container} flexDir="column">
        <Link as={NextLink} href="/loads" w="32px">
          <IconButton
            icon={<ArrowBackIcon w="32px" h="32px" />}
            aria-label="go back to Loads"
            w="32px"
            bg="white"
          />
        </Link>
        <Flex className={styles["order-container"]}>
          <Flex className={styles["left"]}>
            <Box className={styles["text-box"]}>
              <Text className={styles["order-header"]}>
                {t("pages.loads.load.load_id")}
              </Text>
              <Text className={styles["order-text"]}>{id}</Text>
            </Box>
            <Box className={styles["text-box"]}>
              <Text className={styles["order-header"]}>
                {t("pages.loads.load.status")}
              </Text>
              <Text
                className={styles["order-text"]}
                fontWeight="600"
                color={statusColor(currentStatus)}
              >
                {t(`pages.loads.status.${currentStatus}`)}
              </Text>
            </Box>
            <Box className={styles["text-box"]}>
              <Text className={styles["order-header"]}>
                {t("pages.loads.load.client")}
              </Text>
              <Text className={styles["order-text"]}>
                {loadData.destination.client.name}
              </Text>
            </Box>
          </Flex>
          <Flex className={styles["right"]}>
            <Box className={styles["text-box"]}>
              <Text className={styles["order-header"]}>
                {t("pages.loads.load.date")}
              </Text>
              <Text className={styles["order-text"]}>
                {constructLoadDate(loadData.createdAt)}
              </Text>
            </Box>
            <Box className={styles["text-box"]}>
              <Text className={styles["order-header"]}>
                {t("pages.loads.load.destination")}
              </Text>
              <Text className={styles["order-text"]}>
                {loadData.destination.city},
              </Text>
              <Text className={styles["order-text"]}>
                {loadData.destination.country}
              </Text>
            </Box>
          </Flex>
        </Flex>
        {profit && (
          <Text className={styles["profit"]}>
            {t("pages.loads.load.profit")}: +
            {Number(profit).toFixed(2).replace(/\.00$/, "")}€
          </Text>
        )}
        <Flex className={styles["history-container"]} flexDir="row" gap="20px">
          <Flex flexDir="column" className={styles["order-history"]}>
            <Heading size="sm" mb="10px">
              {t("main.history")}
            </Heading>
            {[...loadData.statusHistory].reverse().map((status) => (
              <Flex key={status.id} flexDir="column" mb="10px" color="grey">
                <Text>{t(`pages.loads.status.${status.status}`)}</Text>
                <Text>{`${constructLoadDate(status.date).substring(
                  0,
                  constructLoadDate(status.date).length - 5
                )} | ${status.creator.name}`}</Text>
              </Flex>
            ))}
          </Flex>
          <Flex>
            <Button
              className={styles["change-status-button"]}
              color="white"
              bg="var(--button-grey)"
              fontWeight="400"
              onClick={onStatusChangeOpen}
            >
              {t("pages.loads.load.change-status")}
            </Button>
          </Flex>
        </Flex>
        <Box className={styles["spec-container"]}>
          <Flex justifyContent="space-between" alignItems="center" mt="20px">
            <Heading className={styles["spec-header"]} size="sm" mb="10px">
              {t("pages.loads.load.specification")}
            </Heading>
            <Select
              w="120px"
              mr="40px"
              color="black"
              onChange={(e) =>
                handleQuantityTypeChange(e.target.value as QUANTITY_TYPE)
              }
              value={specType}
            >
              <option value={QUANTITY_TYPE.PIECES}>
                {t("pages.loads.load.pieces")}
              </option>
              <option value={QUANTITY_TYPE.PACKAGES}>
                {t("pages.loads.load.packages")}
              </option>
              <option value={QUANTITY_TYPE.M3}>M3</option>
            </Select>
          </Flex>
          <Table className={styles["spec-table"]}>
            <Thead>
              <Tr>
                <Th>{t("pages.loads.spec-table.type")}</Th>
                <Th>{t("pages.loads.spec-table.dimensions")}</Th>
                <Th>{t("pages.loads.spec-table.quantity")}</Th>
                <Th>{t("pages.loads.spec-table.price")} [€]</Th>
              </Tr>
            </Thead>
            <Tbody>
              {specTableContent.map((row, key) => (
                <Tr
                  key={`${row.productName} ${row.productDimensions} ${row.productQuantity}`}
                >
                  <Td fontWeight={500}>
                    {row.productName}
                    <br />
                    {t(`pages.storage.variants.${String(row.productVariant)}`)}
                  </Td>
                  <Td>{row.productDimensions}</Td>
                  <Td>
                    <Input
                      fontSize="15px"
                      padding="0"
                      textAlign="center"
                      w="80px"
                      onChange={(e) => handleSpecValueChange(e, key)}
                      data-column="quantity"
                      defaultValue={row.productQuantity
                        .toFixed(2)
                        .replace(/\.00$/, "")}
                    />
                  </Td>
                  <Td>
                    <Input
                      fontSize="15px"
                      padding="0"
                      textAlign="center"
                      w="80px"
                      onChange={(e) => handleSpecValueChange(e, key)}
                      data-column="price"
                      defaultValue={row.productPrice
                        .toFixed(2)
                        .replace(/\.00$/, "")}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
        <Flex
          justifyContent="flex-end"
          gap="20px"
          p="20px 20px 20px 0px"
          borderBottom="5px solid var(--light-content)"
        >
          <Button
            color="white"
            bg="var(--button-orange)"
            fontWeight="400"
            onClick={handleUpdateProductDetails}
            isLoading={isUpdateLoadProductsLoading}
          >
            {t("buttons.edit")}
          </Button>
          <Link href={`/calculations/${loadData.id}`}>
            <Button color="white" bg="var(--button-blue)">
              {t("pages.loads.load.calculation")}
            </Button>
          </Link>
        </Flex>
        {isUpdateLoadProductsError && (
          <Text color="red">
            {t(mapAxiosErrorToLabel(updateLoadProductsError))}
          </Text>
        )}
        {isUpdateLoadError && (
          <Text color="red">{t(mapAxiosErrorToLabel(updateLoadError))}</Text>
        )}
        <Flex m="30px 0px" justifyContent="flex-start" alignItems="center">
          <Heading size="sm" mb="10px" ml="40px">
            {t("pages.loads.load.documents")}
          </Heading>
        </Flex>
        <Table className={styles["file-table"]}>
          <Thead>
            <Tr>
              <Th>{t("pages.loads.load.file")}</Th>
              <Th>{t("pages.loads.load.download")}</Th>
            </Tr>
          </Thead>
        </Table>
        <Flex
          pr="20px"
          justifyContent="flex-end"
          m="20px 0px 20px 0px"
          gap="20px"
        >
          <Button color="white" bg="var(--button-dark-orange)" fontWeight="400">
            {t("buttons.add")}
          </Button>
          <Button bg="var(--button-green)" color="white" fontWeight="400">
            {t("pages.loads.load.download-all")}
          </Button>
        </Flex>
        <ChangeStatusModal
          id={loadData.id}
          onClose={onStatusChangeClose}
          isOpen={isStatusChangeOpen}
          oldStatus={
            loadData.statusHistory[loadData.statusHistory.length - 1].status
          }
        />
        <AlertDialog
          isOpen={isQuantityConfirmOpen}
          onClose={onQuantityConfirmClose}
          leastDestructiveRef={cancelRef}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {t("pages.loads.load.bad-quantity.bad-quantity-entered")}
              </AlertDialogHeader>

              <AlertDialogBody>
                <InvalidValueModalText
                  specType={specType}
                  newProductDetails={newProductDetails}
                  loadData={loadData}
                />
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onQuantityConfirmClose}>
                  {t("buttons.cancel")}
                </Button>
                <Button
                  colorScheme="green"
                  onClick={() => {
                    onQuantityConfirmClose();
                    handleInvalidQuantity();
                  }}
                  ml={3}
                >
                  {t("buttons.confirm")}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex>
    </Flex>
  );
};
