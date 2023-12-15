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
    <div class="flex">
      <a-button @click="connect()">连接</a-button>
      <a-button @click="getBalance()">获取ETH余额</a-button>
      <a-button @click="getTokenBalance()">获取代币余额</a-button>
      
      <br>
      {{ walletData }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ethers } from 'ethers';
import Web3 from 'web3'
import { message } from "ant-design-vue"

const walletData = reactive({
  /** 接受地址 */
  address: '0xeA5932F2f446ca61D41425FA7a0A560A413a1F0B',
  /** 支付金额 */
  amount:0.01,
});

import { Client } from 'sui-wallet';
// {
//   // 设置 SUI 钱包的连接参数，如节点地址等 最新版不需要
// }
const client = new Client();

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
