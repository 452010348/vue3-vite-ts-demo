import { TronChainId } from '../constants'
import { tronErrors } from '../tronError'
import type { Token } from './Token'
export { TRX }
class TRX implements Token {
    public readonly symbol = 'TRX'
  
    public constructor(public contracts: Record<TronChainId, string>) {}
  
    public async fetchBalance(address: string, chainId: string) {
      const tronWeb = (window as any).tronWeb
      const balance = await tronWeb?.trx.getBalance(address)
      return balance ? Number(balance) / 10 ** 6 : 0
    }
  
    public async transfer(params: {
      fromAddress: string
      toAddress: string
      chainId: string
      amount: string
      broadcast: boolean
    }) {
      const tronWeb = (window as any).tronWeb
      const { fromAddress, toAddress, amount, broadcast } = params
  
      try {
        const tx = await tronWeb.transactionBuilder.sendTrx(
          toAddress,
          tronWeb.toSun(amount),
          fromAddress,
        )
        const signedTx = await tronWeb?.trx.sign(tx)
  
        if (broadcast) {
          const broastTx = await tronWeb?.trx.sendRawTransaction(signedTx)
          return broastTx
        }
  
        return signedTx
      }
      catch (err) {
        if (
          typeof err === 'string'
          && err.includes('Confirmation declined by user')
        )
          throw tronErrors.TRANSFER_REJECTED()
  
        throw tronErrors.TRANSFER_ERROR()
      }
    }
  }
