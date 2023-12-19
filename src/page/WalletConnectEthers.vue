<script setup lang="ts">
// import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/vue'

// // 1. Get projectId at https://cloud.walletconnect.com
// const projectId = '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d'

// // 2. Set chains
// const mainnet = {
//   chainId: 1,
//   name: 'Ethereum',
//   currency: 'ETH',
//   explorerUrl: 'https://etherscan.io',
//   rpcUrl: 'https://cloudflare-eth.com'
// }

// // 3. Create modal
// const metadata = {
//   name: 'My Website',
//   description: 'My Website description',
//   url: 'https://mywebsite.com',
//   icons: ['https://avatars.mywebsite.com/']
// }

// createWeb3Modal({
//   ethersConfig: defaultConfig({ 
//     metadata,
//     defaultChainId: 1,
//     enableEIP6963: true,
//     enableInjected: true,
//     enableCoinbase: true,
//     rpcUrl: '...' // used for the Coinbase SDK
//   }),
//   chains: [mainnet],
//   projectId
// })

// import { useWeb3Modal } from '@web3modal/ethers/vue'
//   // 4. Use modal composable
//   const modal = useWeb3Modal()




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
// let walletProvider:any;

// function getWalletProvider(){
//   walletProvider = modal.getWalletProvider()
// }

// async function getBalance(){
//   if(!isConnected) throw Error("User disconnected")

//   const ethersProvider =  new BrowserProvider(walletProvider)
//   const signer = await ethersProvider.getSigner()
//   // The Contract object
//   const USDTContract = new Contract(USDTAddress, USDTAbi, signer)
//   const USDTBalance = await USDTContract.balanceOf(address)

//   console.log(formatUnits(USDTBalance, 18))
// }
</script>

<template>
  <div>
    <br><br>
    <button @click="modal.open()">Open Connect Modal</button>
    <button @click="modal.open({ view: 'Networks' })">Open Network Modal</button>
    <br><br>
    <button @click="getWalletProvider">getWalletProvider</button>
    <button @click="getBalance">getBalance</button>
  </div>
</template>