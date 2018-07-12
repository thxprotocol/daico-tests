module.exports = async (callback) => {
  const CREATE_REFUND_POLL_TIME = await PollManagedFund.at(PollManagedFund.address).refundPollDates.call(0)
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

  await timeTravel(CREATE_REFUND_POLL_TIME - (web3.eth.getBlock('latest').timestamp))

  blocktime = await web3.eth.getBlock('latest').timestamp

  console.log("Time is now " + new Date(blocktime * 1000))
}
