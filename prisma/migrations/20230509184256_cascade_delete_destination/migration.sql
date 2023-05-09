-- DropForeignKey
ALTER TABLE "Destination" DROP CONSTRAINT "Destination_clientId_fkey";

-- AddForeignKey
ALTER TABLE "Destination" ADD CONSTRAINT "Destination_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
