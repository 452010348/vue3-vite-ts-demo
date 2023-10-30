export const tronErrors = {
  /** 未发现目标钱包 */
  NOT_FOUND_WALLET: () => new Error('[NOT_FOUND_WALLET] 未发现目标钱包'),
  /** 未发现 Provider */
  NOT_FOUND_PROVIDER: () => new Error('[NOT_FOUND_PROVIDER] 未发现 Provider'),
  /** 不支持此 Chain */
  NOT_SUPPORTED_CHAIN: () => new Error('[NOT_SUPPORTED_CHAIN] 不支持此 Chain'),
  /** 不支持此 Token */
  NOT_SUPPORTED_TOKEN: () => new Error('[NOT_SUPPORTED_TOKEN] 不支持此 Token'),
  /** 不支持此操作 */
  NOT_SUPPORTED_OPERATION: () => new Error('[NOT_SUPPORTED_OPERATION] 不支持此操作'),
  /** 连接钱包被取消 */
  CONNECT_WALLET_REJECTED: () => new Error('[CONNECT_WALLET_REJECTED] 连接钱包被取消'),
  /** 同一个 DApp 已经启动了连接钱包的请求，并且弹出窗口尚未关闭 */
  CONNECT_WALLET_NOT_CLOSED: () => new Error('[CONNECT_WALLET_NOT_CLOSED] 连接钱包窗口未关闭'),
  /**
   * 当：
   * 1. 钱包已锁定;
   * 2. 钱包首次安装，并且没有钱包帐户;
   */
  WALLET_LOCKED: () => new Error('[WALLET_LOCKED] 钱包已锁定'),
  /** 连接钱包错误 */
  CONNECT_WALLET_ERROR: () => new Error('[CONNECT_WALLET_ERROR] 连接钱包错误'),
  /** 切换网络被取消 */
  SWITCH_CAHIN_REJECTED: () => new Error('[SWITCH_CAHIN_REJECTED] 切换网络被取消'),
  /** 切换网络错误 */
  SWITCH_CAHIN_ERROR: () => new Error('[SWITCH_CAHIN_ERROR] 切换网络错误'),
  /** 获取网络信息错误 */
  GET_CAHIN_ERROR: () => new Error('[GET_CAHIN_ERROR] 获取网络错误'),
  /** 不支持此网络 */
  NOT_SUPPORTED_CAHIN: () => new Error('[NOT_SUPPORTED_CAHIN] 不支持此网络'),
  /** 获取账户地址错误 */
  GET_ADDRESS_ERROR: () => new Error('[GET_ADDRESS_ERROR] 获取账户地址错误'),
  /** 获取余额错误 */
  GET_BALANCE_ERROR: () => new Error('[GET_BALANCE_ERROR] 获取余额错误'),
  /** 转账被取消 */
  TRANSFER_REJECTED: () => new Error('[TRANSFER_REJECTED] 转账被取消'),
  /** 转账错误 */
  TRANSFER_ERROR: () => new Error('[TRANSFER_ERROR] 转账错误'),
}

export function sameError(errorFn: () => Error, error: any) {
  return errorFn().message === error?.message
}
