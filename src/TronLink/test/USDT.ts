import { TronChainId } from '../constants'
import { tronErrors } from '../tronError'
import type { Token } from './Token'
export { USDT };
class USDT implements Token {
    public readonly symbol = 'USDT'
  
    public constructor(public contracts: Record<TronChainId, string>) {}
  
    public async fetchBalance(address: string, chainId: string) {
      const tronWeb = (window as any).tronWeb
      const contractAddress = this.contracts[chainId as TronChainId]
      debugger
      const contract = await tronWeb?.contract().at(contractAddress)
      const balance = await contract!.balanceOf(address).call()
  
      return Number(balance) / 10 ** 6
    }
  
    public async transfer(params: {
      fromAddress: string
      toAddress: string
      chainId: string
      amount: string
      broadcast: boolean
    }) {
      const tronWeb = (window as any).tronWeb
      const { fromAddress, toAddress, amount, chainId, broadcast } = params
      const contractAddress = this.contracts[chainId as TronChainId]
      const parameter = [
        { type: 'address', value: toAddress },
        { type: 'uint256', value: tronWeb?.toSun(amount) },
      ]
  
      try {
        const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
          contractAddress,
          'transfer(address,uint256)',
          {},
          parameter,
          tronWeb.address.toHex(fromAddress),
        )
        const signedTx = await tronWeb?.trx.sign(transaction.transaction)
  
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
  