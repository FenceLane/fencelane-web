import {
  CURRENCY,
  ExpansesInfo,
  InitialCosts,
  OrderProductInfo,
  QUANTITY_TYPE,
  TransportInfo,
} from "../types";

export const calculateProfitsPerProducts = (
  expansesList: InitialCosts[],
  productData: OrderProductInfo[],
  transportCostPerM3: number,
  rate: number
) => {
  return [...expansesList].map((item, key: number) => {
    let summaryCost = 0;
    Object.entries(item).forEach((expanse) => {
      //dodawanie do sumarycznego kosztu jednej paczki wszystkich kosztów cząstkowych:
      const expanseData = expanse[1];
      let expanseCost = Number(expanseData.price);
      if (expanseData.currency === CURRENCY.PLN) {
        expanseCost = expanseCost / rate;
      }
      if (expanseData.quantityType === QUANTITY_TYPE.M3) {
        expanseCost =
          expanseCost * Number(productData[key].product.volumePerPackage);
      }
      if (expanseData.quantityType === QUANTITY_TYPE.PIECES) {
        expanseCost =
          expanseCost * Number(productData[key].product.itemsPerPackage);
      }
      summaryCost += expanseCost;
    });
    summaryCost +=
      transportCostPerM3 * Number(productData[key].product.volumePerPackage); // koszty i cena transportu produktu za jedna paczke
    summaryCost *= productData[key].quantity; // wszystkie koszty tego produktu (za całość)
    const totalPrice =
      Number(productData[key].price) *
      Number(productData[key].product.volumePerPackage) *
      productData[key].quantity; // całkowita kwota płacona przez klienta, czyli cena za 1m3 razy przelicznik m3 razy ilosc paczek
    return Number(totalPrice - summaryCost); //zarobek na 1 produkcie (za wszystkie jego paczki)
  }); // jest to tablica przechowująca całkowity profit kolejno na każdym produkcie
};

export const customExpanseDataToCalculation = (
  expanses: ExpansesInfo,
  specType: QUANTITY_TYPE,
  currency: CURRENCY,
  eurRate: string,
  transportCostPerM3: number
) => {
  return Object.values(expanses).map((product) => {
    let quantity;
    switch (specType) {
      case QUANTITY_TYPE.PACKAGES:
        quantity = product[0].productOrder.quantity;
        break;
      case QUANTITY_TYPE.M3:
        quantity =
          product[0].productOrder.quantity *
          Number(product[0].productOrder.product.volumePerPackage);
        break;

      case QUANTITY_TYPE.PIECES:
        quantity =
          product[0].productOrder.quantity *
          Number(product[0].productOrder.product.itemsPerPackage);
        break;
    }
    let currencyMultiplier;
    switch (currency) {
      case CURRENCY.EUR:
        currencyMultiplier = 1;
        break;
      case CURRENCY.PLN:
        currencyMultiplier = Number(eurRate);
    }
    return {
      name: product[0].productOrder.product.category.name,
      dimensions: product[0].productOrder.product.dimensions,
      quantity: quantity,
      price: product[0].productOrder.price,
      vpp: product[0].productOrder.product.volumePerPackage,
      ipp: product[0].productOrder.product.itemsPerPackage,
      totalProfitOfProduct:
        (Number(product[0].productOrder.price) *
          product[0].productOrder.quantity *
          Number(product[0].productOrder.product.volumePerPackage) -
          product.map((value) => Number(value.price)).reduce((a, b) => a + b) *
            product[0].productOrder.quantity -
          transportCostPerM3 *
            Number(product[0].productOrder.product.volumePerPackage) *
            product[0].productOrder.quantity) *
        currencyMultiplier,
    };
  });
};

export const transportCostPerM3ToCalculation = (
  transportCost: TransportInfo,
  expanses: ExpansesInfo
) => {
  return (
    Number(transportCost.price) /
    Number(
      Object.values(expanses)
        .map(
          (product) =>
            product[0].productOrder.quantity *
            Number(product[0].productOrder.product.volumePerPackage)
        )
        .reduce((acc, cost) => acc + cost)
    )
  );
};
