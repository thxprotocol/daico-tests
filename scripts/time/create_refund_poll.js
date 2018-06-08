const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");

module.exports = async (callback) => {
  const CREATE_REFUND_POLL_TIME = 1554076800; // 01.04.2019
  const jsonrpc = '2.0'
  const id = 0

  let blocktime = web3.eth.getBlock('latest').timestamp

  const send = (method, params = []) => {
    web3.currentProvider.send({id, jsonrpc, method, params})
  }

  const timeTravel = async seconds => {
    await send('evm_increaseTime', [seconds])
    await send('evm_mine')
  }

  await timeTravel(CREATE_REFUND_POLL_TIME - blocktime)

  blocktime = await web3.eth.getBlock('latest').timestamp

  console.log("Time is now " + new Date(blocktime * 1000))
}
