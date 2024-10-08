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
import styles from "./OrderDetails.module.scss";
import {
  useUpdateOrder,
  useUpdateOrderProducts,
} from "../../../../lib/api/hooks/orders";
import { mapAxiosErrorToLabel } from "../../../../lib/server/BackendError/BackendError";
import { constructOrderDate } from "../../../../lib/util/dateUtils";
import { InvalidValueModalText } from "./InvalidValueModalText/InvalidValueModalText";
import { OrderFileUploadButton } from "./OrderFileActionButtons/OrderFileUploadButton/OrderFileUploadButton";
import { OrderFileActionButtons } from "./OrderFileActionButtons/OrderFileActionButtons";
import { OrderDownloadAllFilesButton } from "./OrderFileActionButtons/OrderDownloadAllFilesButton";
import { userFeatures } from "../../../../lib/util/userRoles";
import { useUser } from "../../../../lib/hooks/UserContext";

interface OrderDetailsProps {
  orderData: OrderInfo;
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

export const OrderDetails = ({
  orderData,
  expanses,
  transportCost,
}: OrderDetailsProps) => {
  const {
    isOpen: isQuantityConfirmOpen,
    onOpen: onQuantityConfirmOpen,
    onClose: onQuantityConfirmClose,
  } = useDisclosure(); // do modala potwierdzajacego korektę invalid value

  const {
    mutate: updateOrder,
    error: updateOrderError,
    isError: isUpdateOrderError,
    isSuccess: isUpdateOrderSuccess,
    isLoading: isUpdateOrderLoading,
  } = useUpdateOrder(orderData.id); // aktualizowanie ordera (profitu)

  const cancelRef = React.useRef(null);

  const { user } = useUser();

  const { t } = useContent();

  const [specType, setSpecType] = useState(QUANTITY_TYPE.PIECES);

  const { profit } = orderData;

  const initialNewProductDetails = orderData.products.map((product) => ({
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

  const id = orderData.id.toString().padStart(4, "0");

  const currentStatus =
    orderData.statusHistory[orderData.statusHistory.length - 1].status; //branie ostatniego statusu jako obecnego

  const specTableContent = orderData.products.map((product) => {
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
      orderData.products.map((product) => {
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

  const handleUpdateSuccess = (orderProducts: Partial<OrderProductInfo>[]) => {
    if (expanses && transportCost) {
      const productOrderIds = Object.keys(expanses);

      const products = Object.assign(
        {},
        ...orderProducts.map((product, key) => ({
          [product.productOrderId!]: {
            price: product.price,
            quantity: product.quantity,
            totalCost:
              Number(orderData.products[key].product.volumePerPackage) *
              (product.quantity || 0) *
              Number(product.price),
          },
        }))
      );

      const expansesPerProduct = productOrderIds.map(
        (productOrderId: string) => {
          return (
            Number(products[productOrderId].quantity) *
            expanses[productOrderId]
              .map((currentExpanse) => currentExpanse.price)
              .reduce((acc: number, price: string) => acc + Number(price), 0)
          );
        }
      );
      const totalExpanses = expansesPerProduct.reduce((a, b) => a + b, 0);
      const totalClientCost = Object.values(products).reduce(
        (sum: number, product: typeof products) =>
          sum + Number(product.totalCost),
        0
      );
      const newProfit = (totalClientCost -
        totalExpanses -
        Number(transportCost.price)) as number;

      updateOrder({ profit: newProfit });
    }
  }; // success

  const {
    mutate: updateOrderProducts,
    error: updateOrderProductsError,
    isError: isUpdateOrderProductsError,
    isSuccess: isUpdateOrderProductsSuccess,
    isLoading: isUpdateOrderProductsLoading,
  } = useUpdateOrderProducts(orderData.id, handleUpdateSuccess);

  const handleInvalidQuantity = () => {
    const calculatedNewProductDetails = newProductDetails.map(
      (product, key) => {
        switch (specType) {
          case QUANTITY_TYPE.PIECES:
            return {
              productOrderId: product.productOrderId,
              quantity: Math.floor(
                product.quantity /
                  orderData.products[key].product.itemsPerPackage
              ),
              price: String(
                (Number(product.price) *
                  orderData.products[key].product.itemsPerPackage) /
                  Number(orderData.products[key].product.volumePerPackage)
              ),
            };
          case QUANTITY_TYPE.PACKAGES:
            return {
              productOrderId: product.productOrderId,
              quantity: Math.floor(product.quantity),
              price: String(
                Number(product.price) /
                  Number(orderData.products[key].product.volumePerPackage)
              ),
            };
          case QUANTITY_TYPE.M3:
            return {
              productOrderId: product.productOrderId,
              quantity: Math.floor(
                product.quantity /
                  Number(orderData.products[key].product.volumePerPackage)
              ),
              price: String(product.price),
            };
        }
      }
    ); // zamiana wszystkich ilosci na paczki i cen za metr (tak sa trzymane w bazie)
    updateOrderProducts(calculatedNewProductDetails);
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
                orderData.products[key].product.itemsPerPackage,
              price: String(
                (Number(product.price) *
                  orderData.products[key].product.itemsPerPackage) /
                  Number(orderData.products[key].product.volumePerPackage)
              ),
            };
          case QUANTITY_TYPE.PACKAGES:
            return {
              productOrderId: product.productOrderId,
              quantity: product.quantity,
              price: String(
                Number(product.price) /
                  Number(orderData.products[key].product.volumePerPackage)
              ),
            };
          case QUANTITY_TYPE.M3:
            return {
              productOrderId: product.productOrderId,
              quantity:
                product.quantity /
                Number(orderData.products[key].product.volumePerPackage),
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
      updateOrderProducts(calculatedNewProductDetails);
    }
  }; // aktualizowanie ilosci i cen produktow

  return (
    <Flex flexDir="column" alignItems="center">
      <Flex className={styles.container} flexDir="column" borderRadius="5px">
        <Link as={NextLink} href="/loads" w="32px">
          <IconButton
            icon={<ArrowBackIcon w="32px" h="32px" />}
            aria-label="go back to orders"
            w="32px"
            bg="white"
          />
        </Link>
        <Flex className={styles["order-container"]}>
          <Flex className={styles["left"]}>
            <Box className={styles["text-box"]}>
              <Text className={styles["order-header"]}>
                {t("pages.orders.order.order_id")}
              </Text>
              <Text className={styles["order-text"]}>{id}</Text>
            </Box>
            <Box className={styles["text-box"]}>
              <Text className={styles["order-header"]}>
                {t("pages.orders.order.parent_order_id")}
              </Text>
              <Text className={styles["order-text"]}>
                {orderData.parentOrderId}
              </Text>
            </Box>
            <Box className={styles["text-box"]}>
              <Text className={styles["order-header"]}>
                {t("pages.orders.order.status")}
              </Text>
              <Text
                className={styles["order-text"]}
                fontWeight="600"
                color={statusColor(currentStatus)}
              >
                {t(`pages.orders.status.${currentStatus}`)}
              </Text>
            </Box>
          </Flex>
          <Flex className={styles["right"]}>
            <Box className={styles["text-box"]}>
              <Text className={styles["order-header"]}>
                {t("pages.orders.order.date")}
              </Text>
              <Text className={styles["order-text"]}>
                {constructOrderDate(orderData.createdAt)}
              </Text>
            </Box>
            <Box className={styles["text-box"]}>
              <Text className={styles["order-header"]}>
                {t("pages.orders.order.client")}
              </Text>
              <Text className={styles["order-text"]}>
                {orderData.destination.client.name}
              </Text>
            </Box>
            <Flex className={styles["text-box"]} flexDirection="column">
              <Text className={styles["order-header"]}>
                {t("pages.orders.order.destination")}
              </Text>
              <Text className={styles["order-text"]}>
                {orderData.destination.city},
              </Text>
              <Text className={styles["order-text"]}>
                {orderData.destination.country}
              </Text>
            </Flex>
          </Flex>
          <Box className={styles["right-bottom"]}>
            {profit && userFeatures.loads.isProfitAllowed(user.role) && (
              <Text className={styles["profit"]}>
                {Number(profit).toFixed(2).replace(/\.00$/, "")}€
              </Text>
            )}
          </Box>
        </Flex>
        <Flex className={styles["history-container"]} flexDir="row" gap="20px">
          <Flex flexDir="column" className={styles["order-history"]}>
            <Heading size="sm" mb="10px">
              {t("main.history")}
            </Heading>
            {[...orderData.statusHistory].reverse().map((status) => (
              <Flex key={status.id} flexDir="column" mb="10px" color="grey">
                <Text>{t(`pages.orders.status.${status.status}`)}</Text>
                <Text>{`${constructOrderDate(status.date).substring(
                  0,
                  constructOrderDate(status.date).length - 5
                )} | ${status.creator.name}`}</Text>
              </Flex>
            ))}
          </Flex>
          <Flex>
            <Button
              className={styles["change-status-button"]}
              color="white"
              bg="var(--details-status-button-color)"
              fontWeight="400"
              onClick={onStatusChangeOpen}
            >
              {t("pages.orders.order.change-status")}
            </Button>
          </Flex>
        </Flex>
        <Box className={styles["spec-container"]}>
          <Flex justifyContent="space-between" alignItems="center" mt="20px">
            <Heading className={styles["spec-header"]} size="sm" mb="10px">
              {t("pages.orders.order.specification")}
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
                {t("pages.orders.order.pieces")}
              </option>
              <option value={QUANTITY_TYPE.PACKAGES}>
                {t("pages.orders.order.packages")}
              </option>
              <option value={QUANTITY_TYPE.M3}>M3</option>
            </Select>
          </Flex>
          <Table className={styles["spec-table"]}>
            <Thead>
              <Tr>
                <Th textAlign="left">{t("pages.orders.spec-table.type")}</Th>
                <Th textAlign="center">
                  {t("pages.orders.spec-table.dimensions")}
                </Th>
                <Th textAlign="center">
                  {t("pages.orders.spec-table.quantity")}
                </Th>
                <Th textAlign="center">
                  {t("pages.orders.spec-table.price")} [€]
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {specTableContent.map((row, key) => (
                <Tr
                  key={`${row.productName} ${row.productDimensions} ${row.productQuantity} ${row.productVariant} ${row.productQuantity}`}
                >
                  <Td fontWeight={500} textAlign="left">
                    {row.productName}
                    <br />
                    {t(`pages.storage.variants.${String(row.productVariant)}`)}
                  </Td>
                  <Td textAlign="center">{row.productDimensions}</Td>
                  <Td textAlign="center">
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
                  <Td textAlign="center">
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
        {isUpdateOrderProductsError && (
          <Text color="red">
            {t(mapAxiosErrorToLabel(updateOrderProductsError))}
          </Text>
        )}
        {isUpdateOrderError && (
          <Text color="red">{t(mapAxiosErrorToLabel(updateOrderError))}</Text>
        )}
        <Flex
          justifyContent="flex-end"
          gap="20px"
          p="20px"
          borderBottom="5px solid var(--light-content)"
        >
          {userFeatures.loads.isEditProductsButtonAllowed(user.role) && (
            <Button
              color="white"
              bg="var(--details-edit-button-color)"
              fontWeight="400"
              onClick={handleUpdateProductDetails}
              isLoading={isUpdateOrderProductsLoading}
            >
              {t("buttons.edit")}
            </Button>
          )}
          {userFeatures.loads.isCalculationButtonAllowed(user.role) && (
            <Link href={`/calculations/${orderData.id}`}>
              <Button
                fontWeight="400"
                color="white"
                bg="var(--details-calcs-button-color)"
              >
                {t("pages.orders.order.calculation")}
              </Button>
            </Link>
          )}
        </Flex>
        <Flex
          flexDir="column"
          gap="10px"
          className={styles["documents-container"]}
        >
          <Flex alignItems="center">
            <Heading size="sm" mb="10px">
              {t("pages.orders.order.documents")}
            </Heading>
          </Flex>
          <Table className={styles["file-table"]}>
            <Thead>
              <Tr>
                <Th>{t("pages.orders.order.file")}</Th>
                <Th>{t("pages.orders.order.actions")}</Th>
              </Tr>
            </Thead>
            {orderData.files.map((file) => (
              <Tbody key={file.key}>
                <Tr>
                  <Td>{file.key}</Td>
                  <Td>
                    <OrderFileActionButtons
                      file={file}
                      orderId={orderData.id}
                    />
                  </Td>
                </Tr>
              </Tbody>
            ))}
          </Table>
        </Flex>
        <Flex justifyContent="flex-end" m="20px " gap="20px">
          <OrderFileUploadButton orderId={orderData.id} />
          <OrderDownloadAllFilesButton
            orderId={orderData.id}
            files={orderData.files}
          />
        </Flex>
        <ChangeStatusModal
          id={orderData.id}
          onClose={onStatusChangeClose}
          isOpen={isStatusChangeOpen}
          oldStatus={
            orderData.statusHistory[orderData.statusHistory.length - 1].status
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
                {t("pages.orders.order.bad-quantity.bad-quantity-entered")}
              </AlertDialogHeader>

              <AlertDialogBody>
                <InvalidValueModalText
                  specType={specType}
                  newProductDetails={newProductDetails}
                  orderData={orderData}
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
