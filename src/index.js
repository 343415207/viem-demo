"use strict";
exports.__esModule = true;
var viem_1 = require("viem");
var chains_1 = require("viem/chains");
var client = (0, viem_1.createPublicClient)({
    chain: chains_1.mainnet,
    transport: (0, viem_1.http)()
});
var blockNumber = await client.getBlockNumber();
console.log("blockNumber is " + blockNumber);
