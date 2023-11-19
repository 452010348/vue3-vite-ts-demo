import { message } from 'ant-design-vue'
// 引入 bs58check 库
import bs58check from 'bs58check'

/**
 * 等待时间
 * @param {Number} msec 毫秒 1000 
 * @returns {Promise<void>}
 */
export function sleep(msec=1000) :Promise<void> {
  return new Promise(r => setTimeout(r, msec))
}

/**
 * 数字转精度
 * @param {Number} balance 兑换金额 200
 * @param {Number} precision 币种精度 6 
 * @returns {String} 200000000
 */
export function decimals(balance: number, precision = 6) {
  return String(balance * 10 ** precision)
}

/**
 * 清除括号以及内容
 * @param {String} symbol USDT(TRC20)
 * @returns {String} USDT
 */
export function reContent(symbol: string) {
  return symbol.replace(/\(.*?\)/g, '').trim()
}

/**
 * 响应式对象数据互换
 * @param {Object} a 数据1 
 * @param {Object} b 数据2
 */
export function exchange(a: any, b: any) {
  // 交换两个对象的属性
  const propertiesToSwap = Object.keys(a)
  // 交换属性
  propertiesToSwap.forEach((property: string) => {
    [a[property], b[property]] = [toRaw(b)[property], toRaw(a)[property]]
  })
  // 打印更新后的对象
  console.log('666 from:', toRaw(a))
  console.log('666 to:', toRaw(b))
}

export function catchMsg(error:any){
  typeof error === 'string' && message.error(error)
  error?.message && message.error(error.message)
}

export function base58checkToHex(base58Str="TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq") {
  const decoded = bs58check.decode(base58Str)
  const hexStr = Array.from(decoded).map(byte => byte.toString(16).padStart(2, '0')).join('')
  return hexStr
}


export function getStatus(status:string, oldStatus=0){
  let num = oldStatus 
  switch(status){
      // waiting user deposi
    case "wait_deposit_send": //"等待存币",
    case "wait_deposit_send_fail": //"存币失败",
    case "wait_for_information": //"请联系客服",
    case "timeout": //"兑换超时",
      num = 0 
      break;
      // Exchange
    case "wait_receive_confirm":// "发币确认中...",
    case "wait_exchange_push":// "正在兑换中...",
    case "wait_exchange_return":// "正在兑换中...",
    case "wait_exchange_return_success":// "正在兑换中...",
    case "ERROR":// "正在兑换中...",
      num = 1
      break;
      // send
    case "wait_enough_send": //"正在发币中...",
    case "wait_receive_send": //: "兑换完成，等待发币",
    case "wait_refund_send": //: "等待退币",
    case "wait_refund_confirm": //: "退币确认中...",
      num = 2
      break
    // Success
    case "receive_complete": // "发币完成",
    case "refund_complete": // "退币完成",
      num = 3
      break
  }
  return num
}

// // 创建取消令牌
// let controllerQute: any = null
// function from_swapQute() {
//   state.loading.quote = true;
//   controllerQute && controllerQute.cancel('Operation canceled by the user.')
//   controllerQute = axios.CancelToken.source()
//   return apisPay.swapQute(
//     {
//       fromTokenAddress: state.fromCurrency.address,
//       fromTokenChain: state.fromCurrency.chain,
//       fromTokenAmount: decimals(state.fromMoney.amount, state.fromCurrency.decimals),
//       toTokenAddress: state.toCurrency.address,
//       toTokenChain: state.toCurrency.chain,
//       // userAddr?: "",
//       is_platform_approve: 1,
//     },
//     {
//       // errorMessageMode: 'none',
//       cancelToken: controllerQute.token,
//     },
//   ).then((data) => {
//     state.toMoney.amount = Number(data?.toTokenAmount ?? 0)
//     state.toMoney.precision = Number(data?.toTokenDecimal ?? 0)
//   }).finally(()=>{
//     state.loading.quote = false;
//   })
// }
// function to_swapQute() {
//   state.loading.quote = true;
//   controllerQute && controllerQute?.cancel('Operation canceled by the user.')
//   controllerQute = axios.CancelToken.source()
//   return apisPay.swapQute(
//     {
//       fromTokenAddress: state.toCurrency.address,
//       fromTokenChain: state.toCurrency.chain,
//       fromTokenAmount: decimals(state.fromMoney.amount, state.toCurrency.decimals),
//       toTokenAddress: state.fromCurrency.address,
//       toTokenChain: state.fromCurrency.chain,
//       // userAddr?: "",
//       is_platform_approve: 1,
//     },
//     {
//       // errorMessageMode: 'none',
//       cancelToken: controllerQute.token,
//     },
//   ).then((data) => {
//     state.fromMoney.amount = Number(data?.toTokenAmount ?? 0)
//     state.fromMoney.precision = Number(data?.toTokenDecimal ?? 0)
//   }).finally(()=>{
//     state.loading.quote = false;
//   })
// }

// /** 上版本的支付方式 */
// async function testPay(){
//   // const accountInfo = await tron.fetchAccount(state.currentWallet.address)
//   const chainId = await tron.fetchChainId()
//   // const balance = await tron.fetchBalance(state.currentWallet.address, chainId, state.fromCurrency.symbol)
//   // console.log('666', balance)
//   const signedTx = await tron.transfer({
//     fromAddress: state.currentWallet.address,
//     toAddress: configQuerier.data.value?.wallet.payment_exchange_address ?? '',
//     chainId,
//     amount: state.fromMoney.amount.toFixed(6),
//     symbol: reContent(state.fromCurrency.symbol),
//     broadcast: true,
//   })
//   await apis.exchangeCreateOrder({ requestBody: {
//     exchange_symbol: reContent(state.toCurrency.symbol),
//     pay_symbol: reContent(state.fromCurrency.symbol),
//     receive_address: state.receive.address || state.currentWallet.address,
//     signed_txn: signedTx,
//   } }, { errorMessageMode: 'none' })
// }