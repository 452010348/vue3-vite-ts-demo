<template>
  <div>
    <h2>sui-wallet</h2>
    <p>钱包地址: </p>
    {{ Web3.utils.toWei('1', 'gwei') }}
    {{ Web3.utils.toBN('123000').mul(Web3.utils.toBN(2)) }}
    <br>
    <br>
    <div class="flex">
      <!-- <a-button @click="connect()">连接</a-button>
      <a-button @click="getBalance()">获取ETH余额</a-button>
      <a-button @click="getTokenBalance()">获取代币余额</a-button> -->

      <!-- <pre style="font-size: 20px;">{{ Object.keys(sui) }}</pre> -->
      <!-- <button @click="suiRef.onClick();">Connect to Sui</button> -->



      <!-- <pre>{{ Object.keys(sui) }}</pre> -->


    </div>
    <AButton @click="onMountedRef">Connect to Sui</AButton>
    <SignInWithSui ref="$sui" :visible="false" />
    <SignInWithSuiButton @connected="onConnected" />

    <SignInWithSuiButton @adapter="onAdapter" defaultChain="sui:mainnet" />


  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ethers } from 'ethers';
import Web3 from 'web3'
// import { message } from "ant-design-vue"
// const walletData = reactive({
//   /** 接受地址 */
//   address: '0xeA5932F2f446ca61D41425FA7a0A560A413a1F0B',
//   /** 支付金额 */
//   amount: 0.01,
// });

// import * as sui from "@mysten/dapp-kit";
// const currentAccount = sui.useCurrentAccount();
// console.log(currentAccount);
import { SignInWithSui, SignInWithSuiButton } from 'vue-sui';

// 声明响应式引用
const $sui = ref();

// 绑定引用
const onMountedRef = () => {
  $sui.value.onClick()
  console.log(Object.keys($sui.value))
};

const onAdapter = async (adapter) => {
  debugger
  const tx = new $sui.TransactionBlock();
  const data = await adapter.signAndExecuteTransactionBlock({ transactionBlock: tx });
  console.log(data)
}





async function onConnected(suiInBrowser: any) {
  console.log('sui-wallet.vue onConnected')
  const provider = await suiInBrowser.getProvider(); // instance of JsonRpcProvider
  const suiMaster = await suiInBrowser.getSuiMaster(); // instance of suidouble SuiMaster instance
  const currentChain = suiInBrowser.getCurrentChain(); // chain id, `sui:mainnet`  `sui:testnet` etc
  const connectedAddress = suiInBrowser.getAddress(); // "0x42ff3..."
  console.log(provider, suiMaster, currentChain, connectedAddress)
}
// console.log(suiRef.value.$refs.sui);
// const networkConfig = {
//   "localnet": "http://127.0.0.1:9000",
//   "devnet": "https://fullnode.devnet.sui.io:443",
//   "testnet": "https://fullnode.testnet.sui.io:443",
//   "mainnet": "https://fullnode.mainnet.sui.io:443"
// }



// import { Client } from 'sui-wallet';
// {
//   // 设置 SUI 钱包的连接参数，如节点地址等 最新版不需要
// }
// const client = new Client();
// console.log(client)

// // 获取钱包地址

// // 在浏览器中发起连接授权
// async function connect(){
//   client.connect().then(() => {
//     console.log('已成功连接授权');
//     walletData.address = client.getAddress();
//     message.success(walletData.address)
//   }).catch((error:any) => {
//     console.error('连接授权失败', error);
//   });
// }

// // 获取 eth 余额
// async function getBalance(){
//   client.getBalance('ETH').then((balance:any) => {
//     console.log(`当前账户 ETH 余额为：${balance}`);
//     message.success(balance)
//   }).catch((error:any) => {
//     console.error('获取余额时出错', error);
//   });
// }

// async function getTokenBalance() {
//   const tokenAddress = '0x...'; // 代币合约地址
//   // 获取代币余额
//   client.getTokenBalance(tokenAddress).then((balance:any) => {
//     console.log(`当前账户代币余额为：${balance}`);
//     message.success(balance)
//   }).catch((error:any) => {
//     console.error('获取代币余额时出错', error);
//   });
// }
</script>
