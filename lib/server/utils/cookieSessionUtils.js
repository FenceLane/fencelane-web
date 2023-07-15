"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.parseCookieHeader =
  exports.deleteCookieSession =
  exports.renewCookieSession =
  exports.createCookieSession =
  exports.shouldRefreshSession =
  exports.getDeleteSessionCookie =
  exports.getSessionCookie =
  exports.getRegisterTokenExpirationDate =
  exports.getSessionExpirationDate =
  exports.SET_COOKIE_HEADER =
    void 0;
var prismaClient_1 = require("../../prisma/prismaClient");
var ServerConfig_1 = require("../../AppConfig/ServerConfig");
exports.SET_COOKIE_HEADER = "Set-Cookie";
var EXPIRE_SESSION_AFTER = 1000 * 60 * 60 * 24 * 4; //4 days in ms
var EXPIRE_REGISTER_TOKEN_AFTER = 1000 * 60 * 60 * 24 * 4; //4 days in ms
var REFRESH_SESSION_AFTER = 1000 * 60 * 60 * 24; // 1 day in ms
var getSessionExpirationDate = function () {
  return new Date(Date.now() + EXPIRE_SESSION_AFTER);
};
exports.getSessionExpirationDate = getSessionExpirationDate;
var getRegisterTokenExpirationDate = function () {
  return new Date(Date.now() + EXPIRE_REGISTER_TOKEN_AFTER);
};
exports.getRegisterTokenExpirationDate = getRegisterTokenExpirationDate;
var getSessionCookie = function (_a) {
  var sessionId = _a.sessionId,
    expireAt = _a.expireAt;
  return "authorization="
    .concat(sessionId, "; Expires=")
    .concat(expireAt.toUTCString(), "; ")
    .concat(
      ServerConfig_1.ServerConfig.ENV.REQUIRE_HTTPS ? "Secure; " : "",
      "HttpOnly; Path=/;"
    );
};
exports.getSessionCookie = getSessionCookie;
var getDeleteSessionCookie = function () {
  return "authorization=; Expires=".concat(
    new Date(Date.now()).toUTCString(),
    "; Path=/;"
  );
};
exports.getDeleteSessionCookie = getDeleteSessionCookie;
var shouldRefreshSession = function (refreshedAt) {
  return (
    new Date(Date.now()) >
    new Date(refreshedAt.getTime() + REFRESH_SESSION_AFTER)
  );
};
exports.shouldRefreshSession = shouldRefreshSession;
var createCookieSession = function (res, _a) {
  var user = _a.user;
  return __awaiter(void 0, void 0, void 0, function () {
    var sessionExpirationDate, newSession, sessionCookie;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          sessionExpirationDate = (0, exports.getSessionExpirationDate)();
          return [
            4 /*yield*/,
            prismaClient_1.prismaClient.session.create({
              data: { expiresAt: sessionExpirationDate, userId: user.id },
            }),
          ];
        case 1:
          newSession = _b.sent();
          sessionCookie = (0, exports.getSessionCookie)({
            sessionId: newSession.id,
            expireAt: sessionExpirationDate,
          });
          res.setHeader(exports.SET_COOKIE_HEADER, sessionCookie);
          return [2 /*return*/, sessionCookie];
      }
    });
  });
};
exports.createCookieSession = createCookieSession;
var renewCookieSession = function (res, _a) {
  var sessionId = _a.sessionId;
  return __awaiter(void 0, void 0, void 0, function () {
    var sessionExpirationDate, session, sessionCookie;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          sessionExpirationDate = (0, exports.getSessionExpirationDate)();
          return [
            4 /*yield*/,
            prismaClient_1.prismaClient.session.update({
              where: { id: sessionId },
              data: { expiresAt: sessionExpirationDate },
            }),
          ];
        case 1:
          session = _b.sent();
          sessionCookie = (0, exports.getSessionCookie)({
            sessionId: session.id,
            expireAt: sessionExpirationDate,
          });
          res.setHeader(exports.SET_COOKIE_HEADER, sessionCookie);
          return [2 /*return*/, session];
      }
    });
  });
};
exports.renewCookieSession = renewCookieSession;
var deleteCookieSession = function (req, res) {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          //delete cookie
          res.setHeader(
            exports.SET_COOKIE_HEADER,
            (0, exports.getDeleteSessionCookie)()
          );
          //delete session
          return [
            4 /*yield*/,
            prismaClient_1.prismaClient.session["delete"]({
              where: { id: req.cookies.authorization },
            }),
          ];
        case 1:
          //delete session
          _a.sent();
          return [2 /*return*/, true];
      }
    });
  });
};
exports.deleteCookieSession = deleteCookieSession;
var parseCookieHeader = function (cookieHeader) {
  var cookies = {};
  // Split the cookie header string by semicolons
  var cookieParts = cookieHeader.split(";");
  for (
    var _i = 0, cookieParts_1 = cookieParts;
    _i < cookieParts_1.length;
    _i++
  ) {
    var part = cookieParts_1[_i];
    // Split each part by the first occurrence of '=' to separate the cookie name and value
    var _a = part.trim().split("="),
      name_1 = _a[0],
      value = _a[1];
    // Assign the name and value to the cookies object
    cookies[name_1] = value;
  }
  return cookies;
};
exports.parseCookieHeader = parseCookieHeader;
