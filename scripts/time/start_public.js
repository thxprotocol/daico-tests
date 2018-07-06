const THXTokenDAICO = artifacts.require("THXTokenDAICO");

module.exports = async (callback) => {
  const SALE_START_TIME = await THXTokenDAICO.at(THXTokenDAICO.address).SALE_START_TIME.call()
  const jsonrpc = '2.0'
  const id = 0

  let blocktime = web3.eth.getBlock('latest').timestamp

  const send = (method, params = []) => {
    web3.currentProvider.send({ id, jsonrpc, method, params })
  }

  const timeTravel = async seconds => {
    await send('evm_increaseTime', [seconds])
    await send('evm_mine')
  }

  await timeTravel(SALE_START_TIME - blocktime)

  blocktime = await web3.eth.getBlock('latest').timestamp

  console.log("Time is now " + new Date(blocktime * 1000))
}
