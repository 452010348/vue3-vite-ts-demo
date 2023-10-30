import axios from 'axios'

import { tronErrors } from './tronError'
import type { TronRes } from './constants'
import { TronChainId, tronGridGatewayByChainId, tronScanGatewayByChainId } from './constants'
import { tokens } from './token/tokens'
import type { WalletGetAccount, WalletGetAccountResource } from './type'
// import { queryClient } from '~/query-client'
// import { client } from '@/utils'

export { Tron }
//  todo 凯没有把没有tron插件的情况考虑进去
const server = axios.create({ timeout: 10 * 1000 })
interface IDelegateResourceParams {
  frozenBalance: number
  ownerAddress: string
  receiveAddress: string
  resourceType: number | string
  isMultiSign: boolean
  multiSignIfo: any
  isLock: boolean
  lockPeriod: number
  options?: any
}
class Tron {
  // public address: undefined | string;
  // public chainId: undefined | string;

  public get tronLink(): Record<string, any> | undefined {
    if (import.meta.env.SSR)
      return
    return (window as any)?.tronLink
  }

  public get tronWeb(): Record<string, any> | undefined {
    if (import.meta.env.SSR)
      return
    return (window as any)?.tronWeb
  }

  public get tron(): Record<string, any> | undefined {
    if (import.meta.env.SSR)
      return
    return (window as any)?.tron
  }

  /** 账户地址 */
  public get address() {
    const address: string = this.tronWeb?.defaultAddress?.base58

    return address || ''
  }

  /** 校验地址 */
  public isAddress(address: any) {
    return !!this.tronWeb?.isAddress(address)
  }

  /** 计算 */
  public fromSun(value: any) {
    return this.tronWeb?.fromSun(value) ? Number(this.tronWeb?.fromSun(value)) : 0
  }

  /** 计算 取整 */
  public fromSunToInteger(value: any) {
    const integer = this.tronWeb?.fromSun(value) ? Number(this.tronWeb?.fromSun(value)) : 0
    return Math.floor(integer)
  }

  /** 连接钱包 */
  public async connect() {
    console.log('connect - 连接钱包')
    // 优先使用 eth_requestAccounts 方法，因为它支持在钱包锁定状态下拉起登录弹窗
    if (this.tron) {
      try {
        const res = await this.tron.request({ method: 'eth_requestAccounts' })
      }
      catch (err: any) {
        if (err?.code === -32002)
          throw tronErrors.CONNECT_WALLET_NOT_CLOSED()
        if (err?.code === 4001)
          throw tronErrors.CONNECT_WALLET_REJECTED()

        throw tronErrors.CONNECT_WALLET_ERROR()
      }
      return true
    }

    if (this.tronWeb) {
      const request = this.tronLink?.request ?? this.tronWeb.request
      const res = await request({ method: 'tron_requestAccounts' })
      if (!res)
        throw tronErrors.WALLET_LOCKED()
      if (res?.code === 4000)
        throw tronErrors.CONNECT_WALLET_NOT_CLOSED()
      if (res.code === 4001)
        throw tronErrors.CONNECT_WALLET_REJECTED()

      return true
    }
  }

  /** 检测是否下载有tronlink插件 */
  public supported() {
    return !!(window as any)?.tronWeb
  }

  /** 获取网络 ID */
  public async fetchChainId() {
    let chainId = ''
    try {
      // const { blockID = '' } = await queryClient.fetchQuery({
      //   queryKey: ['tron-block-by-number'],
      //   staleTime: 3000,
      //   queryFn: () => this.tronWeb?.trx.getBlockByNumber(0),
      // })
      const blockID = await this.tronWeb?.trx.getBlockByNumber(0)
      chainId = `0x${blockID.slice(-8)}`
    }
    catch (err) {
      throw tronErrors.GET_CAHIN_ERROR()
    }

    if (!Object.values(TronChainId).includes(chainId as any))
      throw tronErrors.NOT_SUPPORTED_CAHIN()

    return chainId as TronChainId
  }

  /**
   * 获取账号信息
   * @param address 账户地址
   */
  public async fetchAccount(address: string) {
    const chainId = await this.fetchChainId()
    const url = `${tronGridGatewayByChainId.get(chainId)}/wallet/getaccount`
    const res = await server.request({
      url,
      method: 'POST',
      data: {
        address: this.tronWeb?.address.toHex(address),
      },
    })

    if (res.status === 200)
      return res.data as WalletGetAccount
  }

  /**
   * 获取账户的资源信息
   * @param address 账户地址
   */
  public async fetchAccountResource(address: string) {
    const chainId = await this.fetchChainId()
    const url = `${tronGridGatewayByChainId.get(chainId)}/wallet/getaccountresource`
    const res = await server.request({
      url,
      method: 'POST',
      data: {
        address: this.tronWeb?.address.toHex(address),
      },
    })

    if (res.status === 200)
      return res.data as WalletGetAccountResource
  }

  /**
   * 获取最大可委托量
   * @param address 账户地址
   * @param resourceType 资源类型
   */
  public async fetchCanDelegatedMaxSize(address: string, resourceType: TronRes) {
    const chainId = await this.fetchChainId()
    const url = `${tronGridGatewayByChainId.get(chainId)}/wallet/getcandelegatedmaxsize`
    const res = await server.request({
      url,
      method: 'POST',
      data: {
        owner_address: this.tronWeb?.address.toHex(address),
        type: resourceType,
      },
    })

    if (res.status === 200)
      return res.data?.max_size as number
  }

  /**
   * 质押V2
   * @param params 质押参数
   * @param params.amount 质押金额
   * @param params.resourceType 资源类型
   * @param params.address 账户地址
   */
  public async freezeBalanceV2(params: {
    amount: number
    resourceType: TronRes
    address: string
    options?: any
  }): Promise<any> {
    const result = await this.tronWeb?.transactionBuilder.freezeBalanceV2(
      params.amount,
      params.resourceType,
      params.address,
      params.options,
    )

    const signedTx = await this.tronWeb?.trx.sign(result)

    const broastTx = await this.tronWeb?.trx.sendRawTransaction(signedTx)

    return broastTx
  }

  /**
   * 质押V2（多签）
   * @param params 质押参数
   * @param params.isMulti 是否多签
   * @param params.permissionId 多签权限ID
   * @param params.isOwnerPermission 是否是 owner 权限
   * @param params.amount 质押金额
   * @param params.resourceType 资源类型
   * @param params.address 账户地址
   */
  public async freezeBalanceV2ByMultiSign(params: {
    permissionId: number
    isOwnerPermission: boolean
    amount: number
    resourceType: TronRes
    address: string
    options?: any
  }): Promise<any> {
    const result = await this.tronWeb?.transactionBuilder.freezeBalanceV2(
      params.amount,
      params.resourceType,
      params.address,
      params.options,
    )

    const multiSign = await this.tronWeb?.trx.multiSign(result, '', params.permissionId)

    if (
      params.isOwnerPermission
      && params.permissionId
      && multiSign.raw_data.contract[0]?.Permission_id === undefined
    ) {
      if (client.isPc)
        throw new Error($t('j9XvC4U_eesWmprjUs82U'))
      else
        throw new Error($t('w8wSlabd68LaH3p-m3eX7'))
    }

    const broastTx = await this.tronWeb?.trx.sendRawTransaction(multiSign)

    return broastTx
  }

  /**
   * 解压
   */
  public async unfreezeBalance() {}

  /**
   * 委托（代理）
   */
  public async delegateResource() {}

  /**
   * 获取币种余额
   * @param address 账户地址
   * @param chainId 链ID
   * @param symbol 代币 Symbol，默认为 TRX
   */
  public async fetchBalance(address: string, chainId: string, symbol = 'TRX') {
    const _symbol = symbol.toUpperCase()
    const token = tokens.find(t => t.symbol === _symbol)
    if (token)
      return await token.fetchBalance(address, chainId)
    else return 0
  }

  /**
   * 转账
   * @param params 转账参数
   * @param params.fromAddress 转出地址
   * @param params.toAddress 转入地址
   * @param params.chainId 链ID
   * @param params.symbol 代币 Symbol
   * @param params.amount 转账金额
   * @param params.broadcast 是否广播
   */
  public async transfer(params: {
    fromAddress: string
    toAddress: string
    chainId: string
    symbol: string
    amount: string
    broadcast?: boolean
  }) {
    const _symbol = params.symbol.toUpperCase()
    const token = tokens.find(t => t.symbol === _symbol)
    debugger
    if (token) {
      return await token.transfer({
        ...params,
        broadcast: params.broadcast ?? false,
      })
    }
  }

  /**
   * 代理的订单列表
   * @param limit
   * @param start
   * @param type
   */
  public async fetchAgencyOrders(params: { address: string; limit: number; start: number; type: number }) {
    const chainId = await this.fetchChainId()
    const url = `${tronScanGatewayByChainId.get(chainId)}/account/resourcev2`
    const res = await server.request({
      url,
      method: 'GET',
      params: {
        address: params.address,
        limit: params.limit,
        start: params.start,
        type: params.type,
      },
    })
    if (res.status === 200)
      return res as any
  }

  /**
   * 撤销资源代理
   * @param params
   */
  public async undelegateResource(params: {
    amount: number | undefined
    receiverAddress: string
    resource: 'BANDWIDTH' | 'ENERGY'
    address: string
    options?: any
  }) {
    const transaction = await this.tronWeb?.transactionBuilder.undelegateResource(
      params.amount,
      params.receiverAddress,
      params.resource,
      params.address,
    )
    const signedTx = await this.tronWeb?.trx.sign(transaction)
    const broastTx = await this.tronWeb?.trx.sendRawTransaction(signedTx)
    return broastTx
  }

  /**
   * 拉起钱包
   * @param params
   */
  public async sendTrx(params: {
    toAddress: string | undefined
    cancelAmount: number
    payAddress: string | undefined
  }) {
    const amount = this.tronWeb?.toSun(params.cancelAmount)

    const signedTx = await this.tronWeb?.transactionBuilder.sendTrx(params.toAddress, amount, params.payAddress)
    return signedTx
  }

  /**
   * 获取投票数额
   * @address string
   */
  public async getAccountResources(address: string) {
    const res = await this.tronWeb?.trx.getAccountResources(address)
    return res
  }

  /**
   * 投票
   * @param address
   * @param votes
   * @param options
   */
  public async vote(addeess: string, votes: any, options?: any) {
    const votesResp = await this.tronWeb?.transactionBuilder.vote(votes, addeess)
    const signedTRX = await this.tronWeb?.trx.sign(votesResp)
    const broastTRX = await this.tronWeb?.trx.sendRawTransaction(signedTRX)
    return broastTRX
  }

  /**
   * 获取权限
   * @param hex 权限 hex
   * @param id 匹配到的权限ID
   */
  public getPermission(hex: string, id: number) {
    let op = ''
    const hexSplit = hex.split('')
    hexSplit.forEach((h, index) => {
      const f2 = Number.parseInt(h, 16).toString(2)
      const f24 = f2.padStart(4, '0')
      const f24reverse = f24.split('').reverse().join('')
      if (index % 2 === 1 && index !== hexSplit.length - 1)
        op += `${f24reverse}:`
      else
        op += f24reverse
    })
    let permission = ''
    op.split(':').forEach((e) => {
      permission += e.substring(4, 8) + e.substring(0, 4)
    })
    const ids: number[] = []
    permission.split('').forEach((e, index) => {
      if (Number(e) === 1)
        ids.push(index)
    })
    return ids.includes(id)
  }

  /**
   * 委托出售
   * @param params
   */
  public async getDelegateResourceSign(params: {
    c2CPreDelegateResp: any
    isMultiSign: boolean
    permissionId: number
    isOwnerPermission: boolean
  }) {
    if (toValue(params.isMultiSign)) {
      const res = await this.tronWeb?.trx.multiSign(params.c2CPreDelegateResp, '', params.permissionId)
      if (
        !params.isOwnerPermission
        && params.permissionId > 0
        && res.raw_data.contract[0]?.Permission_id === undefined
      ) {
        if (client.isPc)
          throw new Error($t('j9XvC4U_eesWmprjUs82U'))
        else
          throw new Error($t('w8wSlabd68LaH3p-m3eX7'))
      }
      return res
    }
    else {
      const res = await this.tronWeb?.trx.sign(params.c2CPreDelegateResp)
      if (!res)
        throw new Error('已取消')
      return res
    }
  }

  /**
   * 委托 后端广播
   * @param params todo 参数类型
   */
  public async delegateResourceServerBroadcast(params: IDelegateResourceParams) {
    try {
      const delegateResourceTx = await this.tronWeb?.transactionBuilder.delegateResource(
        params.frozenBalance,
        params.receiveAddress,
        params.resourceType,
        params.ownerAddress,
        params.isLock,
        params.lockPeriod,
        params?.options,
      )

      if (toValue(params.isMultiSign)) {
        const res = await this.tronWeb?.trx.multiSign(delegateResourceTx, '', params.multiSignIfo.permissionId)
        if (
          !params.multiSignIfo.isOwnerPermission
          && params.multiSignIfo.permissionId > 0
          && res.raw_data.contract[0]?.Permission_id === undefined
        ) {
          if (client.isPc)
            throw new Error('j9XvC4U_eesWmprjUs82U')
          else
            throw new Error('w8wSlabd68LaH3p-m3eX7')
        }
        return res
      }
      else {
        return await this.tronWeb?.trx.sign(delegateResourceTx)
      }
    }
    catch (e) {
      if (typeof e === 'string')
        throw new Error(e)
      else
        throw new Error('')
    }
  }

  public async payTRXServerBroadcast(params) {
    try {
      const amount = this.tronWeb?.toSun(params.amount)
      const tx = await this.tronWeb?.transactionBuilder.sendTrx(params.toAddress, amount, params.fromAddress)
      const res = await this.tronWeb?.trx.sign(tx)
      if (res)
        return res
    }
    catch (e) {
      throw new Error(e)
    }
  }
}
