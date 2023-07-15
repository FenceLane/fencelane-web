"use strict";
exports.__esModule = true;
exports.prismaClient = void 0;
var client_1 = require("@prisma/client");
var globalForPrisma = global;
exports.prismaClient =
  globalForPrisma.prismaClient || new client_1.PrismaClient();
if (process.env.NODE_ENV !== "production")
  globalForPrisma.prismaClient = exports.prismaClient;
