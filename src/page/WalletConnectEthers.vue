<script setup lang="ts">
import { message } from 'ant-design-vue';
import { nextTick, onMounted, reactive } from 'vue';


// 1.配置
const projectId = 'a5d19cad465451fb165833a07e1c0162';


// 2.配置
// import { mainnet, arbitrum } from 'viem/chains'
// const chains = [mainnet, arbitrum]

// import * as chainObj from '@wagmi/core/chains';
// const chains = [...Object.values(chainObj)];


// // 3.初始化
// import * as wagmiCore from '@wagmi/core'
// import * as web3modalEthereum from '@web3modal/ethereum';
// const configureChains = wagmiCore.configureChains(chains, [web3modalEthereum.w3mProvider({ projectId })]);
// wagmiCore.createConfig({
//   autoConnect: true,
//   connectors: web3modalEthereum.w3mConnectors({ projectId, chains }),
//   publicClient: configureChains.publicClient,
// });

// const ethereumClient = new web3modalEthereum.EthereumClient(createConfig, chains);
// import { Web3Modal } from '@web3modal/html';
// const web3modal = new Web3Modal({ projectId }, ethereumClient);
// console.log( web3modal );

const walletData = reactive<{accounts:String,chainId:number|string}>({
  accounts:"",
  chainId:"",
})

// // 4.初始化
import * as ethereumProvider from '@walletconnect/ethereum-provider'
import Web3 from 'Web3'

let web3: Web3;
const methods = ["personal_sign", "eth_sendTransaction", "eth_accounts", "eth_requestAccounts", "eth_call", "eth_getBalance", "eth_sendRawTransaction", "eth_sign", "eth_signTransaction", "eth_signTypedData", "eth_signTypedData_v3", "eth_signTypedData_v4", "wallet_switchEthereumChain", "wallet_addEthereumChain", "wallet_getPermissions", "wallet_requestPermissions", "wallet_registerOnboarding", "wallet_watchAsset", "wallet_scanQRCode"]
const events = ["accountsChanged", "chainChanged", "message", "disconnect", "connect"]
let provider;
 nextTick(async() => {
  provider = await ethereumProvider.EthereumProvider.init({
    projectId,
    showQrModal: true, // REQUIRED 设置为“true”才能使用 @walletconnect/modal
    // /* 可选的命名空间-推荐用于多链应用程序 */
    optionalChains: [5, 56, 137, 10, 100, 84532, 97, 11155111, 80001, 3448148188], // chains - 可选名称空间所必需的
    // optionalMethods: ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign'], // ethereum methods - 所有的以太坊方法都是默认设置的，所以这不是必需的
    // optionalEvents, // ethereum events - 所有以太坊事件都是默认设置的，所以这不是必需的
    /* 必需的命名空间-不推荐多链应用 */
    chains: [1], //  chain ids
    methods, // ethereum methods
    events, // ethereum events
    // rpcMap, // 每个链的可选rpc url
    // metadata, // 应用程序的可选元数据
    // qrModalOptions // OPTIONAL -默认为' undefined '，参见 https://docs.walletconnect.com/web3modal/options
  })
  // await provider.connect()
  // chain changed
  //  provider.on('chainChanged', ()=>{})
  // accounts changed
  provider.on('accountsChanged', (e) => {
    console.log('accountsChanged', e , provider);
    walletData.accounts = provider?.accounts
    walletData.chainId = provider?.chainId
  })
  // session established
  provider.on('connect', (e) => {
    console.log('connect', e);
  })
  // session event - chainChanged/accountsChanged/custom events
  provider.on('session_event', (e) => {
    console.log('session_event', e);
  })
  // connection uri
  provider.on('display_uri', (uri: string) => {
    // ... 自定义逻辑
    console.log("WalletConnectEthers.vue display_uri", uri)
  })
  // session disconnect
  provider.on('disconnect', (e) => {
    console.log('disconnect', e);
  })
  
  return provider
})


// 5.web3
// import Web3 from 'Web3'
// let web3:Web3 = new Web3(provider)

/*
// 6 .方法调用
await provider.connect()
// or
await provider.enable()

const result = await provider.request({ method: 'eth_requestAccounts' })
*/

async function getProvider(id){
  return await ethereumProvider.EthereumProvider.init({
    projectId,
    showQrModal: true, // REQUIRED 设置为“true”才能使用 @walletconnect/modal
    // /* 可选的命名空间-推荐用于多链应用程序 */
    optionalChains: [id], // chains - 可选名称空间所必需的
    // optionalMethods: ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign'], // ethereum methods - 所有的以太坊方法都是默认设置的，所以这不是必需的
    // optionalEvents, // ethereum events - 所有以太坊事件都是默认设置的，所以这不是必需的
    /* 必需的命名空间-不推荐多链应用 */
    chains: [id], //  chain ids
    methods, // ethereum methods
    events, // ethereum events
  })
}

import ERC20 from '../TronLink/ERC20.json'

async function connect() {
  provider.connect()
}
async function approve() {
  // await provider.switchEthereumChain(5)
  let provider = await getProvider(97)
  try {
    const from_token_address = "0x561CDD3184985e5d38bb2d4c41b4c19C938d8cF7"
    const contract_address = "0x66e2c8806D223AF496207A370B0133f53Fc06D6E"
    const from_address = provider.accounts[0]
    const amount = "21000000"; // 授权的代币数量 "1 000 000" 不需要使用 toHex

    web3 = new Web3(provider)
    const contract = new web3.eth.Contract(ERC20, from_token_address);// 创建代币合约实例
    const approveTransaction = contract.methods.approve(contract_address, amount);
    const gasLimit = await approveTransaction.estimateGas({ from: from_address });
    let gasPrice = await web3.eth.getGasPrice();
    const tx = await approveTransaction.send({ from: from_address, gasPrice: gasPrice.toString(), gas: gasLimit.toString() });
    console.log('tx: >>', tx);
    return tx
  } catch (error) {
    console.error(error)
  }
}


</script>

<template>
  <div style="margin-top: 50px;">
    {{ Object.values(walletData) }}
    <br><br>
    <a-button @click="connect">Connect</a-button>
    <br>
    <a-button @click="approve">approve</a-button>

  </div>

</template>