import type { TronChainId } from '../constants'

export abstract class Token {
  public abstract readonly symbol: string

  public abstract contracts: Record<TronChainId, string>

  /**
   * 获取账户余额
   * @param address 账户地址
   * @param chainId 链ID
   */
  public abstract fetchBalance(address: string, chainId: string): Promise<number>

  /**
   * 转账
   * @param params 转账参数
   * @param params.fromAddress 转出地址
   * @param params.toAddress 转入地址
   * @param params.chainId 链ID
   * @param params.amount 转账金额
   * @param params.broadcast 是否广播
   */
  public abstract transfer(params: {
    fromAddress: string
    toAddress: string
    chainId: string
    amount: string
    broadcast: boolean
  }): Promise<any>
}
