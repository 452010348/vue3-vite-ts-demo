<script setup lang="ts">
import { message } from 'ant-design-vue'
import { nextTick } from "vue"

import { sepolia } from 'viem/chains'
import * as viemChains from 'viem/chains'
console.log( viemChains )

//=======================================================================================
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/vue'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'a5d19cad465451fb165833a07e1c0162'

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
}

// 3. Create modal
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com',
  icons: ['https://avatars.mywebsite.com/']
}

 createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [sepolia],
  projectId,

  // themeMode: 'light'
  defaultChain: [sepolia]
  // tokens: {
  //   1: {
  //     address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  //     image: 'token_image_url' //optional
  //   },
  //   137: {
  //     address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  //     image: 'token_image_url' //optional
  //   }
  // }
})



//=======================================================================================
import { useWeb3Modal , useDisconnect} from '@web3modal/ethers/vue'
  // 4. Use modal composable
const modal = useWeb3Modal()

// ====手动断开连接
const { disconnect } = useDisconnect()
//==== 手动断开连接


//=======================================================================================
import { useWeb3ModalState } from '@web3modal/ethers/vue'
const { open, selectedNetworkId } = useWeb3ModalState()



//=======================================================================================
import { useWeb3ModalTheme} from '@web3modal/ethers/vue'
const { setThemeMode, setThemeVariables, themeMode, themeVariables } = useWeb3ModalTheme()



//=======================================================================================
import { useWeb3ModalAccount } from '@web3modal/ethers/vue'
const { address, chainId, isConnected } = useWeb3ModalAccount()



//=======================================================================================
import { ethers, BrowserProvider, Contract, formatUnits } from 'ethers'

const USDTAddress = '0x561CDD3184985e5d38bb2d4c41b4c19C938d8cF7'

// The ERC-20 Contract ABI, which is a common contract interface
// for tokens (this is the Human-Readable ABI format)
const USDTAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address) view returns (uint)",
  "function transfer(address to, uint amount)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];




 import { useWeb3ModalProvider } from '@web3modal/ethers/vue'
 const { walletProvider } = useWeb3ModalProvider()

import { EthereumProvider } from '@walletconnect/ethereum-provider'
// const provider = await nextTick( async ()=>{
// })
async function getProvider(){
  let provider = await EthereumProvider.init({
    projectId,
    showQrModal: !true, // REQUIRED 设置为“true”才能使用 @walletconnect/modal
    // /* 可选的命名空间-推荐用于多链应用程序 */
    optionalChains: [97, 11155111, 80001, 3448148188], // chains - 可选名称空间所必需的
    // optionalEvents, // ethereum events - 所有以太坊事件都是默认设置的，所以这不是必需的
    /* 必需的命名空间-不推荐多链应用 */
    chains: [11155111], //  chain ids
    // methods, // ethereum methods
    // events, // ethereum events
    // rpcMap, // 每个链的可选rpc url
    // metadata, // 应用程序的可选元数据
    // qrModalOptions // OPTIONAL -默认为' undefined '，参见 https://docs.walletconnect.com/web3modal/options
  })
  return provider
}

async function onSignMessage() {
  const provider = new BrowserProvider(walletProvider)
  const signer = await provider.getSigner()
  const signature = await signer?.signMessage('Hello Web3Modal Ethers')
  console.log(signature)
}


async function getBalance(){
  if(!isConnected) throw Error("User disconnected")

  const ethersProvider =  new BrowserProvider(walletProvider)

  const signer = await ethersProvider.getSigner()
  // The Contract object
  const USDTContract = new Contract(USDTAddress, USDTAbi, signer)
  const USDTBalance = await USDTContract.balanceOf(address)

  console.log(formatUnits(USDTBalance, 18))
}

async function getBalance2(){
  let provider = await getProvider()
  const ethersProvider =  new BrowserProvider(provider)
  
  const signer = await ethersProvider.getSigner()
  // The Contract object
  const USDTContract = new Contract(USDTAddress, USDTAbi, signer)

  const USDTBalance = await USDTContract.balanceOf(address)

  console.log(formatUnits(USDTBalance, 18))
}


 async function switchNetwork(chainId: any): Promise<any> {
    // if (!chain_ethereum.includes(chain)) {
    //   return Promise.reject(new Error('当前链不支持该钱包兑换，请切换对应钱包'))
    // }
    const hex_chainId = `0x${Number(chainId).toString(16)}`
    const provider = await getProvider()
    debugger
    await provider.request({method: "wallet_switchEthereumChain",params: [{ chainId: hex_chainId }]})
    debugger
  }
</script>


<template>
  <div style="margin: 50px;">
    <p>{{ address}} , {{chainId}} , {{isConnected}}</p>
    <w3m-button />
    <br>
    <a-button @click="modal.open()">Open Connect Modal</a-button>
    <a-button @click="modal.open({ view: 'Connect' })">Connect</a-button>
    <a-button @click="modal.open({ view: 'Account'})">Account</a-button>
    <a-button @click="modal.open({ view: 'All wallets' })">All wallets</a-button>
    <a-button @click="modal.open({ view: 'Networks'})">Networks</a-button>
    <a-button @click="modal.open({ view: 'WhatIsANetwork' })">WhatIsANetwork</a-button>
    <a-button @click="modal.open({ view: 'WhatIsAWallet' })">WhatIsAWallet</a-button>
    
    <br><br>

    <a-button @click="disconnect()">断开连接</a-button>
    
    <br>
    
    <p>open: {{ open }} ,  selectedNetworkId: {{ selectedNetworkId }}</p>
 
    <a-button @click="setThemeMode('dark')">设置dark</a-button>
    <a-button @click="setThemeMode('light')">设置light</a-button>
    <a-button @click="setThemeVariables({
      // '--w3m-color-mix': '#00BB7F',
      '--w3m-color-mix-strength': 40,
      '--w3m-z-index':6000
    })">设置样式</a-button>
    <br><br>
    <a-button @click="onSignMessage">onSignMessage</a-button>
    <a-button @click="getBalance">getBalance</a-button>
    <a-button @click="getBalance2">getBalance2</a-button>
    <br><br>
    <a-button @click="switchNetwork(11155111)">switchNetwork(11155111)</a-button>
    <a-button @click="switchNetwork(97)">switchNetwork(97)</a-button>       
  </div>
</template>
