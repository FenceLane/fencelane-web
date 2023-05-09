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
import { OrderInfo, QUANTITY_TYPE } from "../../../../lib/types";
import { ChangeStatusModal } from "./ChangeStatusModal/ChangeStatusModal";
import styles from "./OrderDetails.module.scss";
import { useUpdateOrderProducts } from "../../../../lib/api/hooks/orders";
import { mapAxiosErrorToLabel } from "../../../../lib/server/BackendError/BackendError";

interface OrderDetailsProps {
  orderData: OrderInfo;
}

interface SpecTableTypes {
  productName: string;
  productVariant: string;
  productDimensions: string;
  productQuantity: number;
  productPrice: number;
}

const statusColor = (status: string) => {
  switch (status) {
    case "delivered":
      return "#339926";
    default:
      return "#232ccf";
  }
};
export const OrderDetails = ({ orderData }: OrderDetailsProps) => {
  const {
    isOpen: isQuantityConfirmOpen,
    onOpen: onQuantityConfirmOpen,
    onClose: onQuantityConfirmClose,
  } = useDisclosure();

  const cancelRef = React.useRef(null);

  const [invalidValueText, setInvalidValueText] = useState(<p></p>);

  const { t } = useContent();

  const [specType, setSpecType] = useState(QUANTITY_TYPE.PIECES);

  const profit = orderData.profit;

  const initialNewProductDetails = orderData.products.map((product) => ({
    productOrderId: product.productOrderId,
    quantity: product.quantity * product.product.itemsPerPackage,
    price:
      (Number(product.price) * Number(product.product.volumePerPackage)) /
      product.product.itemsPerPackage,
  }));

  const [newProductDetails, setNewProductDetails] = useState(
    initialNewProductDetails
  ); // dane do zmiany ilosci i ceny produktow w zamowieniu

  const {
    isOpen: isStatusChangeOpen,
    onOpen: onStatusChangeOpen,
    onClose: onStatusChangeClose,
  } = useDisclosure(); // do zmiany statusu

  const id = orderData.id.toString().padStart(4, "0");

  const currentStatus =
    orderData.statusHistory[orderData.statusHistory.length - 1].status; //branie ostatniego statusu jako obecnego

  const days = [
    t("days.monday"),
    t("days.tuesday"),
    t("days.wednesday"),
    t("days.thursday"),
    t("days.friday"),
    t("days.saturday"),
    t("days.sunday"),
  ];

  const displayDate = (rawDate: Date) => {
    const date = new Date(rawDate);
    return (
      (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) +
      "." +
      (Number(date.getMonth()) + 1 < 10
        ? "0" + String(Number(date.getMonth()) + 1)
        : Number(date.getMonth()) + 1) +
      "." +
      date.getFullYear() +
      " | " +
      days[date.getDay()].substring(0, 3)
    );
  };

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
  });

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
    const column = e.target.dataset.column as string;
    const value = e.target.value.replace(/,/g, ".");
    const updatedNewProductDetails = [...newProductDetails];
    updatedNewProductDetails[key] = {
      ...updatedNewProductDetails[key],
      [column]: Number(value),
    };
    setNewProductDetails(updatedNewProductDetails);
  };

  const {
    mutate: updateOrderProducts,
    error: updateOrderProductsError,
    isError: isUpdateOrderProductsError,
    isSuccess: isUpdateOrderProductsSuccess,
    isLoading: isUpdateOrderProductsLoading,
  } = useUpdateOrderProducts(orderData.id, () =>
    setSpecType(QUANTITY_TYPE.PACKAGES)
  );

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
    );
    updateOrderProducts(calculatedNewProductDetails);
    setNewProductDetails(
      calculatedNewProductDetails.map((product) => ({
        ...product,
        price: Number(product.price),
      }))
    );
    if (specType != QUANTITY_TYPE.PIECES) {
      setSpecType(QUANTITY_TYPE.PIECES);
    }
  };

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
    );
    let invalidValue = false;
    setInvalidValueText(<Text>Wprowadzono:</Text>);
    calculatedNewProductDetails.map((product, key) => {
      if (product.quantity !== Math.floor(product.quantity)) {
        invalidValue = true;
        const invalidQuantity = newProductDetails[key].quantity;
        const invalidQuantityInPackages = product.quantity;
        const prefferedNewQuantityInPackages = Math.floor(product.quantity);
        const quantityType = specType;
        if (specType === QUANTITY_TYPE.PACKAGES) {
          setInvalidValueText((prev) => (
            <span>
              {prev}
              <Text fontWeight="500">{`Dla: ${orderData.products[key].product.category.name} ${orderData.products[key].product.dimensions}`}</Text>
              <Text>
                {`${invalidQuantityInPackages.toFixed(
                  2
                )} pakietów. Czy chodziło Ci o ${prefferedNewQuantityInPackages} pakietów? `}
              </Text>
            </span>
          ));
        } else {
          setInvalidValueText((prev) => (
            <span>
              {prev}
              <Text fontWeight="500">{`Dla: ${orderData.products[key].product.category.name} ${orderData.products[key].product.dimensions}`}</Text>
              <Text>
                {`${invalidQuantity} ${quantityType}, co daje ${invalidQuantityInPackages.toFixed(
                  2
                )} pakietów. Czy chodziło Ci o
              ${prefferedNewQuantityInPackages} pakietów? `}
              </Text>
            </span>
          ));
        }
      }
    });
    if (invalidValue) {
      onQuantityConfirmOpen();
    } else {
      updateOrderProducts(calculatedNewProductDetails);
    }
  };

  return (
    <Flex className={styles.container} flexDir="column">
      <Link as={NextLink} href="/orders" w="32px">
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
          <Box className={styles["text-box"]}>
            <Text className={styles["order-header"]}>
              {t("pages.orders.order.client")}
            </Text>
            <Text className={styles["order-text"]}>
              {orderData.client.name}
            </Text>
          </Box>
        </Flex>
        <Flex className={styles["right"]}>
          <Box className={styles["text-box"]}>
            <Text className={styles["order-header"]}>
              {t("pages.orders.order.date")}
            </Text>
            <Text className={styles["order-text"]}>
              {displayDate(orderData.createdAt)}
            </Text>
          </Box>
          <Box className={styles["text-box"]}>
            <Text className={styles["order-header"]}>
              {t("pages.orders.order.destination")}
            </Text>
            <Text className={styles["order-text"]}>
              {orderData.destination.city},
            </Text>
            <Text className={styles["order-text"]}>
              {orderData.destination.country}
            </Text>
          </Box>
        </Flex>
      </Flex>
      {profit && <Text className={styles["profit"]}>Zysk: +{profit}€</Text>}
      <Flex className={styles["history-container"]} flexDir="row">
        <Flex flexDir="column" className={styles["order-history"]}>
          <Heading size="sm" mb="10px">
            {t("main.history")}
          </Heading>
          {[...orderData.statusHistory].reverse().map((status) => (
            <Flex key={status.id} flexDir="column" mb="10px" color="grey">
              <Text>{t(`pages.orders.status.${status.status}`)}</Text>
              <Text>{`${displayDate(status.date).substring(
                0,
                displayDate(status.date).length - 5
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
              <Th>{t("pages.orders.spec-table.type")}</Th>
              <Th>{t("pages.orders.spec-table.dimensions")}</Th>
              <Th>{t("pages.orders.spec-table.quantity")}</Th>
              <Th>{t("pages.orders.spec-table.price")} [€]</Th>
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
      <Flex justifyContent="space-around" mt="10px">
        <Button
          color="white"
          bg="var(--button-orange)"
          fontWeight="400"
          onClick={handleUpdateProductDetails}
          isLoading={isUpdateOrderProductsLoading}
        >
          {t("buttons.edit")}
        </Button>
        <Link href={`/calculations/${orderData.id}`}>
          <Button color="white" bg="var(--button-blue)">
            {t("pages.orders.order.calculation")}
          </Button>
        </Link>
      </Flex>
      {isUpdateOrderProductsError && (
        <Text color="red">
          {t(mapAxiosErrorToLabel(updateOrderProductsError))}
        </Text>
      )}
      <Flex m="40px 0px" justifyContent="space-between" alignItems="center">
        <Heading size="sm" mb="10px" ml="40px">
          {t("pages.orders.order.documents")}
        </Heading>
        <Button
          color="white"
          bg="var(--button-dark-orange)"
          fontWeight="400"
          mr="40px"
        >
          {t("buttons.add")}
        </Button>
      </Flex>
      <Table className={styles["file-table"]}>
        <Thead>
          <Tr>
            <Th>{t("pages.orders.order.file")}</Th>
            <Th>{t("pages.orders.order.download")}</Th>
          </Tr>
        </Thead>
      </Table>
      <Flex mr="20px" justifyContent="flex-end" m="20px 20px 20px 0px">
        <Button bg="var(--button-green)" color="white" fontWeight="400">
          {t("pages.orders.order.download-all")}
        </Button>
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
              Wprowadzono błędną ilość
            </AlertDialogHeader>

            <AlertDialogBody>{invalidValueText}</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onQuantityConfirmClose}>
                Anuluj
              </Button>
              <Button
                colorScheme="green"
                onClick={() => {
                  onQuantityConfirmClose();
                  handleInvalidQuantity();
                }}
                ml={3}
              >
                Potwierdź
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};
