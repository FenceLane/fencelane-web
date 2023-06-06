// import { Flex } from "@chakra-ui/react";
import { useContent } from "../../../lib/hooks/useContent";
import { PRODUCT_VARIANT } from "../../../lib/types";
// import { mapAxiosErrorToLabel } from "../../../lib/server/BackendError/BackendError";
// import { LoadingAnimation } from "../../LoadingAnimation/LoadingAnimation";
import { Commissions } from "./Commissions/Commissions";

export const CommissionsWrapper = () => {
  const { t } = useContent("errors.backendErrorLabel");

  const data = [
    {
      id: 1,
      orderId: 3,
      quantity: 50,
      createDate: "2023-05-25T11:34:33.076Z",
      productData: [
        {
          commissionQuantity: 30,
          productInfo: {
            id: "2f58e52e-3f23-4076-beb6-c42b9f9b0d45",
            dimensions: "121x122",
            variant: "white_dry" as PRODUCT_VARIANT,
            itemsPerPackage: 100,
            volumePerPackage: 10,
            categoryId: "0e7b5a75-1a7e-4a0d-9310-a4b673e88679",
            stock: 40,
            createdAt: "2023-05-18T11:30:05.738Z",
            updatedAt: "2023-05-18T11:34:33.076Z",
            category: {
              id: "0e7b5a75-1a7e-4a0d-9310-a4b673e88679",
              name: "Palisada cylindryczna",
              color: "#D53F8C",
            },
          },
        },
        {
          commissionQuantity: 15,
          productInfo: {
            id: "2f58e52e-3f23-4076-beb6-c42b9f9b0d45",
            dimensions: "100 x 2100",
            variant: "white_dry" as PRODUCT_VARIANT,
            itemsPerPackage: 100,
            volumePerPackage: 10,
            categoryId: "0e7b5a75-1a7e-4a0d-9310-a4b673e88679",
            stock: 40,
            createdAt: "2023-05-18T11:30:05.738Z",
            updatedAt: "2023-05-18T11:34:33.076Z",
            category: {
              id: "0e7b5a75-1a7e-4a0d-9310-a4b673e88679",
              name: "Palisada cylindryczna",
              color: "#D53F8C",
            },
          },
        },
      ],
    },
    {
      id: 2,
      orderId: null,
      createDate: "2023-05-25T11:34:33.076Z",
      productData: [
        {
          commissionQuantity: 20,
          productInfo: {
            id: "2f58e52e-3f23-4076-beb6-c42b9f9b0d45",
            dimensions: "121x122",
            variant: "white_dry" as PRODUCT_VARIANT,
            itemsPerPackage: 100,
            volumePerPackage: 10,
            categoryId: "0e7b5a75-1a7e-4a0d-9310-a4b673e88679",
            stock: 40,
            createdAt: "2023-05-18T11:30:05.738Z",
            updatedAt: "2023-05-18T11:34:33.076Z",
            category: {
              id: "0e7b5a75-1a7e-4a0d-9310-a4b673e88679",
              name: "Palisada cylindryczna",
              color: "#D53F8C",
            },
          },
        },
      ],
    },
  ];

  //   const { isError, error, isLoading, data } = useGetCommissions();

  //   if (isLoading)
  //     return (
  //       <Flex justifyContent="center" alignItems="center" height="100%">
  //         <LoadingAnimation></LoadingAnimation>
  //       </Flex>
  //     );

  //   if (isError) return <p>{t(mapAxiosErrorToLabel(error))}</p>;

  return <Commissions commissions={data} />;
};
