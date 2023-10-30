/** TRON 资源类型 */
export enum TronRes {
  /** 带宽 */
  BANDWIDTH = 0,
  /** 能量 */
  ENERGY = 1,
}

/** TRON 链 ID */
export enum TronChainId {
  /** 主网 */
  Main = '0x2b6653dc',
  /** 尼罗河测试网 */
  Nile = '0xcd8690dc',
}

export const tronScanGatewayByChainId = new Map<string, string>([
  [TronChainId.Main, 'https://apilist.tronscanapi.com/api'],
  [TronChainId.Nile, 'https://nileapi.tronscan.org/api'],
])

export const tronGridGatewayByChainId = new Map<string, string>([
  [TronChainId.Main, 'https://api.trongrid.io'],
  [TronChainId.Nile, 'https://nile.trongrid.io'],
])

export const usdtContractAddress = new Map<string, string>([
  [TronChainId.Main, 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'],
  [TronChainId.Nile, 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'],
])
