<script setup lang="ts">
import { message } from 'ant-design-vue'

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi'

import { mainnet, arbitrum } from 'viem/chains'

// 1. Define constants
const projectId = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
console.log( 'wagmiConfig' )
console.log( wagmiConfig )

// // 3. Create modal
// const modal = createWeb3Modal({ wagmiConfig, projectId, chains })


// import { watchAccount, disconnect, getAccount } from '@wagmi/core'

// function connect() {
//   console.log( getAccount() )
//   modal.open()
//   if ( !getAccount().isConnected) {
//   } 
// }

// import { ref } from 'vue'
// const address = ref(getAccount().address)

// // listening for account changes
// watchAccount(account => {
//   console.log( account?.address ?? '' )
//   address.value = account?.address ?? ''
//   if (account.isConnected) {
//   } else {
//   }
// })


// // 合约
// import { readContract } from '@wagmi/core'
// import { BrowserProvider, Contract, formatUnits } from 'ethers'

// const USDTAddress = '0x617f3112bf5397D0467D315cC709EF968D9ba546'

// // The ERC-20 Contract ABI, which is a common contract interface
// // for tokens (this is the Human-Readable ABI format)
// const USDTAbi = [
//   "function name() view returns (string)",
//   "function symbol() view returns (string)",
//   "function balanceOf(address) view returns (uint)",
//   "function transfer(address to, uint amount)",
//   "event Transfer(address indexed from, address indexed to, uint amount)"
// ];
// const data = readContract({
//   address: USDTAddress,
//   abi: USDTAbi,
//   functionName: 'symbol',
// })


// import * as wagmiCore from '@wagmi/core'
// async function fetchBalance(){
//   let a = await wagmiCore.fetchBalance('0xdEfB419bf2DE2852126b155671e5cd201B30Fe96')
//   console.log( a );
// }
 

// import { EthereumProvider } from '@walletconnect/ethereum-provider'
//   const provider = await EthereumProvider.init({
//   projectId,
//   chains: [1], // chains added to required namespaces
//   optionalChains: [5] // chains added to optional namespaces
// })

</script>


<template>
  <div style="margin: 50px;">
    <!-- <button @click="connect">Connect</button>
    <button @click="modal.open({ view: 'Account' })">modal - view: 'Account'</button>
    <button @click="fetchBalance"><pre>fetchBalance()</pre> </button>
    <br>
    <button @click="disconnect">disconnect</button>
    <br>
    <span>{{ address }}</span> -->
    <!-- <button @click="getBalance()">获取余额</button> -->
    <br>
    <!-- <pre>{{ Object.keys(wagmiCore) }}</pre> -->
    
  </div>
</template>
