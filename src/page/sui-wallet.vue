<template>
  <div>
    <h2>sui-wallet</h2>
    <p>钱包地址: </p>
    {{ ethers.toBeHex('1') }}
    {{ ethers.parseUnits('0.01', 18) }}
    {{ ethers.formatUnits('1000', 3) }}
    {{ Web3.utils.toWei('1', 'gwei') }}
    {{ Web3.utils.toBN('123000').mul(Web3.utils.toBN(2)) }}
    <br>
    <br>
    <button @click="connect()">Connect to Sui</button>
    <!-- <SignInWithSui ref="$sui" :visible="false" defaultChain="sui:testnet" /> -->
    <SignInWithSui ref="$sui" :visible="false" defaultChain="sui:mainnet" />


    <!-- <SignInWithSuiButton @provider="onProvider"  defaultChain="sui:testnet" /> -->
    <!-- <SignInWithSuiButton @suiMaster="onSuiMaster" defaultChain="sui:testnet" /> -->
    <SignInWithSuiButton @connected="onConnected" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ethers } from 'ethers';
import Web3 from 'web3'
// import { message } from "ant-design-vue"
import { SignInWithSui , SignInWithSuiButton} from 'vue-sui';
import { toRef, toRefs } from '@vueuse/core';
const $sui = ref()
async function onConnected(suiInBrowser:any) {
    const provider = await suiInBrowser.getProvider(); // instance of JsonRpcProvider
    const suiMaster = await suiInBrowser.getSuiMaster(); // instance of suidouble SuiMaster instance
    const currentChain = suiInBrowser.getCurrentChain(); // chain id, `sui:mainnet`  `sui:testnet` etc
    const connectedAddress = suiInBrowser.getAddress(); // "0x42ff3..."
}
function connect(){
  $sui.value.onClick()
  console.log( "connect", toRefs($sui.value) )
}

onMounted(()=>{
  console.log( "onMounted", toRefs($sui.value) )


  $sui.value.provider = function(onProvider){
    debugger
  }
})
// const onProvider = async (provider) => {
//     const data = await provider.getObject({id: '0xcc2bd176a478baea9a0de7a24cd927661cc6e860d5bacecb9a138ef20dbab231'});
//     console.log( data );
// }
// const onAdapter = async (adapter) => {
//     const tx = new $sui.value.TransactionBlock();
//     const data = await adapter.signAndExecuteTransactionBlock({transactionBlock: tx});
//     console.log( data );
// }


// async function onSuiMaster(suiMaster) {
//   debugger
//     const currentChain = suiMaster.connectedChain; // chain id, `sui:mainnet`  `sui:testnet` etc
//     const instanceN = suiMaster.instanceN; // you may get few events when state changed, so you may check if it's same instance you had before

//     // and interact with blockchain. Read more in suidouble documentation
//     const pkg = suiMaster.package({
//         id: packageId,
//     });
//     const module = await pkg.getModule('suidouble_color');

//     const eventsResponse = await module.fetchEvents({eventTypeName: 'ColorCreated', order: 'descending'});
//     // if you are connected, you can also execute contract methods:
//     let result = await module.moveCall('mint', ['test', 23]);
//     // etc
// }

// import { Client } from 'sui-wallet';
// // {
// //   // 设置 SUI 钱包的连接参数，如节点地址等 最新版不需要
// // }
// const client = new Client();

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
