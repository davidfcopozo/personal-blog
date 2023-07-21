const BadRequest = require("./bad-request");
const Unauthenticated = require("./unauthenticated");
const NotFound = require("./not-found");
const CustomAPIError = require("./custom-error");

module.exports = { BadRequest, Unauthenticated, NotFound, CustomAPIError };
