/**
 * 类型如果没有的字段，但接口返回的有，则以接口为准，并在类型中添加(字段是必选还是可选？)
 * 接口的命名是用URL，如 wallet/getaccount -> WalletGetAccount
 */

export interface WalletGetAccount {
  address: string
  balance: number
  create_time: number
  latest_opration_time: number
  latest_consume_free_time: number
  net_window_size: number
  account_resource: {
    latest_consume_time_for_energy: number
    energy_window_size: number
    acquired_delegated_frozenV2_balance_for_energy?: number
    delegated_frozenV2_balance_for_energy?: number
  }
  owner_permission: {
    permission_name: string
    threshold: number
    keys: {
      address: string
      weight: number
    }[]
  }
  active_permission: {
    type: string
    id: number
    permission_name: string
    threshold: number
    operations: string
    keys: {
      address: string
      weight: number
    }[]
  }[]
  frozenV2: {
    amount?: number
  }[]
  frozen?: {
    frozen_balance?: number
  }
  asset_optimized: boolean
  acquired_delegated_frozenV2_balance_for_bandwidth?: number
  delegated_frozenV2_balance_for_bandwidth?: number
}

export interface WalletGetAccountResource {
  TotalEnergyLimit: number
  TotalEnergyWeight: number
  TotalNetLimit: number
  TotalNetWeight: number
  freeNetLimit: number
  freeNetUsed?: number
  NetUsed?: number
  NetLimit?: number
  EnergyUsed?: number
  EnergyLimit?: number
}
