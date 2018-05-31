module.exports = async (callback) => {
  const FUTURE_TIMESTAMP = 1538344800;
  const SECONDS_IN_A_DAY = 86400;
  const jsonrpc = '2.0'
  const id = 0

  const send = (method, params = []) => {
    web3.currentProvider.send({ id, jsonrpc, method, params })
  }

  const timeTravel = async seconds => {
    await send('evm_increaseTime', [seconds])
    await send('evm_mine')
  }

  let now = Math.floor(Date.now() / 1000);
  daysUntilFutureTimestamp = Math.ceil( (FUTURE_TIMESTAMP - now) / SECONDS_IN_A_DAY );

  await timeTravel(SECONDS_IN_A_DAY * (daysUntilFutureTimestamp + 1))
}
