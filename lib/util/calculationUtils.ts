import {
  CURRENCY,
  InitialCosts,
  OrderProductInfo,
  QUANTITY_TYPE,
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
