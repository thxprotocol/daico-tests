const OpenSocialDAICO = artifacts.require("OpenSocialDAICO");

module.exports = async (callback) => {
  const CREATE_TAP_POLL_TIME = 1549784558; // Sun, 10 Feb 2019 09:42:38 +0200
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

  await timeTravel(CREATE_TAP_POLL_TIME - blocktime)

  blocktime = await web3.eth.getBlock('latest').timestamp

  console.log("Time is now " + new Date(blocktime * 1000))
}
