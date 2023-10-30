import { TronChainId } from '../constants'

import TRX from './TRX';
import USDT from './USDT';
export { tokens }
debugger;
// 币种列表
const tokens = [
    new TRX({
      [TronChainId.Main]: '',
      [TronChainId.Nile]: '',
    }),
    new USDT({
      [TronChainId.Main]: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      [TronChainId.Nile]: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',
    }),
  ]
  