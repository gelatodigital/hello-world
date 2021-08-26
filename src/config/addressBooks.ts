// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getAddressBookByNetwork = (network: string) => {
  switch (network) {
    case "fantom":
      return {
        gelato: "0xebA27A2301975FF5BF7864b99F55A4f7A457ED10",
        uniswapV2Factory: "0x152eE697f2E276fA89E96742e9bB9aB1F2E61bE3",
        spookyRouter: "0xF491e7B69E4244ad4002BC14e878a34207E38c29",
        spiritRouter: "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52",
        ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // FTM
        WETH: "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83", // wFTM
      };

    case "mainnet":
      return {
        gelato: "0x3CACa7b48D0573D793d3b0279b5F0029180E83b6",
        uniswapV2Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        uniswapV2Router02: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
        limitOrders: "0x037fc8e71445910e1E0bBb2a0896d5e9A7485318",
        uniswapV2Handler: "0x842A8Dea50478814e2bFAFF9E5A27DC0D1FdD37c",
        ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
        WETH: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      };

    case "matic":
      return {
        gelato: "0x7598e84B2E114AB62CAB288CE5f7d5f6bad35BbA",
        uniswapV2Factory: "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32",
        quickswapRouter: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
        ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // MATIC
        WETH: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
      };

    case "ropsten":
    case "hardhat":
      return {
        gelato: "0xCc4CcD69D31F9FfDBD3BFfDe49c6aA886DaB98d9",
        uniswapV2Factory: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        uniswapV2Router02: "0x7a250d5630b4cf539739df2c5dacb4c659f2488d",
        ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        WETH: "0xc778417e063141139fce010982780140aa0cd5ab",
      };

    default: {
      throw new Error(`addressBooks: network: ${network} not supported`);
    }
  }
};
