<script setup>
  import { message } from 'ant-design-vue'

  import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'
  import { mainnet, arbitrum } from 'viem/chains'

  // 1. Get projectId at https://cloud.walletconnect.com
  const projectId = 'a5d19cad465451fb165833a07e1c0162'

  // 2. Create wagmiConfig
  const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com',
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }

  const chains = [mainnet, arbitrum]
  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
  // 3. Create modal
  createWeb3Modal({ wagmiConfig, projectId, chains })



import { useWeb3Modal } from '@web3modal/wagmi/vue'
// 4. Use modal composable
const modal = useWeb3Modal()




// // 智能合约
import { readContract } from '@wagmi/core'
import { ERC20 } from '../TronLink/abi'
const USDTAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
]
const USDTAddress = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d';
const Contract = readContract({
  address: USDTAddress,
  // abi: USDTAbi,
  abi: ERC20,
  functionName: 'balanceOf',
})
console.log(Contract);
// debugger
const tokens = await contract.balanceOf(fromAddress)
// debugger;
</script>


<template>
  <div style="margin: 50px;">
    <button @click="modal.open()">Open Connect Modal</button>
    <button @click="modal.open({ view: 'Networks' })">Open Network Modal</button>
    <!-- <button @click="getBalance()">获取余额</button> -->
  </div>
</template>
