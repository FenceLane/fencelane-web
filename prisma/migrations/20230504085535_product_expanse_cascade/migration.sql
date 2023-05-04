-- DropForeignKey
ALTER TABLE "ProductExpanse" DROP CONSTRAINT "ProductExpanse_productOrderId_fkey";

-- AddForeignKey
ALTER TABLE "ProductExpanse" ADD CONSTRAINT "ProductExpanse_productOrderId_fkey" FOREIGN KEY ("productOrderId") REFERENCES "ProductOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
