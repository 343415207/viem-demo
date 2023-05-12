import { createPublicClient, http, encodeFunctionData, decodeFunctionResult } from 'viem'
import { goerli } from 'viem/chains'
const gasLimitPerCall = 1_000_000
const client = createPublicClient({
  chain: goerli,
  transport: http(),
})

const blockNumber = await client.getBlockNumber();

console.log("blockNumber is " + blockNumber);


async function  callSameFunctionOnMultipleContracts(params) {

  const { addresses, functionName, functionParams, providerConfig, abi } = params

  const blockNumberOverride = providerConfig?.blockNumber ?? undefined

  const callData = encodeFunctionData({
    abi,
    functionName,
    args: functionParams,
  })

  const calls = addresses.map((address) => {
    return {
      target: address,
      callData,
      gasLimit: BigInt(gasLimitPerCall),
    }
  })

  // console.log({ calls }, `About to multicall for ${functionName} across ${addresses.length} addresses`)
  const {
    result: [blockNumber, aggregateResults],
  } = await client.simulateContract({
    abi: abi,
    address: "0xb7E5d9e1d93F2Da116E5A37729BDB1A15C632225",
    functionName: 'multicall',
    args: [calls],
    blockNumber: BigInt(Number(blockNumberOverride),
  })

  // const { blockNumber, returnData: aggregateResults } = await this.multicallContract.callStatic.multicall(calls, {
  //   blockTag: blockNumberOverride && JSBI.toNumber(JSBI.BigInt(blockNumberOverride)),
  // })



  for (let i = 0; i < aggregateResults.length; i++) {
    const { success, returnData } = aggregateResults[i]!

    // Return data "0x" is sometimes returned for invalid calls.
    if (!success || returnData.length <= 2) {
      // console.log(
      //   { result: aggregateResults[i] },
      //   `Invalid result calling ${functionName} on address ${addresses[i]}`,
      // )
      results.push({
        success: false,
        returnData,
      })
      continue
    }

    results.push({
      success: true,
      result: decodeFunctionResult({
        abi,
        functionName,
        data: returnData,
      }) as TReturn,
    })
  }

  // console.log(
  //   { results },
  //   `Results for multicall on ${functionName} across ${addresses.length} addresses as of block ${blockNumber}`,
  // )

  return { blockNumber, results }
}
