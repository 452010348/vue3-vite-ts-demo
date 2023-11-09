<template>
    <div>
        tronLink
        <button @click="onClick()">trx转usdt</button>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';

import Web3 from 'web3'

// 创建一个 Web3 实例，并指定当前提供商
const web3 = new Web3(window?.ethereum);

// 设置合约地址和 ABI
const contractAddress = '0xabcdef123456...';
const contractABI = [...]; // 合约 ABI

// 设置 MetaMask 当前账户
const fromAccount = web3.eth.accounts.wallet[0].address;

// 设置兑换参数
const amount = web3.utils.toWei('1', 'ether'); // 兑换数量
const toAddressA = '0xAAAAAAAAAAAAAAAA...'; // 转账目标地址 A
const toAddressB = '0xBBBBBBBBBBBBBBBB...'; // 转账目标地址 B

// 创建合约实例
const contract = new web3.eth.Contract(contractABI, contractAddress);

// 获取兑换方法
const exchangeMethod = contract.methods.exchange(toAddressA, amount).encodeABI();

// 发送交易
web3.eth.sendTransaction({
  from: fromAccount,
  to: contractAddress,
  data: exchangeMethod
})
.then(txHash => {
  console.log('兑换交易已发送，交易哈希：', txHash);
})
.catch(error => {
  console.error('兑换交易发送失败：', error);
});

</script>