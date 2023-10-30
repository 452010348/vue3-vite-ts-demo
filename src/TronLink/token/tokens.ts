import { TronChainId } from '../constants'
import { tronErrors } from '../tronError'
import type { Token } from './Token'

export { tokens }

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
