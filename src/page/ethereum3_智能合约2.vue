<template>
  <div>
    <h2>ethereum3</h2>
    <a-button @click="aa.allowance">allowance</a-button>
  </div>
</template>

<script setup lang="ts">
import { Web3 } from 'web3';
const web3 = new Web3(window.ethereum);

// 获取路由器合约实例
const routerContractAddress = 'ROUTER_CONTRACT_ADDRESS';
const routerContractABI = [
  /* ROUTER_CONTRACT_ABI */
];
const routerContract = new web3.eth.Contract(routerContractABI, routerContractAddress);

// 可以从 Metamask 获取当前已经连接的账户地址，这里只取第一个账户
const fromAddress = (await web3.eth.getAccounts())[0];
const toTokenCode = 'YOUR_TO_TOKEN_CODE';
const amountOutMin = 'AMOUNT_OUT_MIN';
// 生成交易数据
const data = routerContract.methods.swapEth(toTokenCode, fromAddress, amountOutMin).encodeABI();

// 构建交易对象
const transactionObject = {
  from: fromAddress,
  to: 'ROUTER_CONTRACT_ADDRESS',
  data: data,
  gas: '500000',
  gasPrice: web3.utils.toWei('50', 'gwei'),
};
// 签名交易
const signedTx = await web3.eth.accounts.signTransaction(transactionObject, '<private-key>');

// 广播交易
const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
console.log(`Transaction hash: ${txReceipt.transactionHash}`);
</script>
