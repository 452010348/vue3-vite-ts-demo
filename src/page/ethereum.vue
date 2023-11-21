<template>
    <div>
        tronLink
        <!-- <button @click="onClick()">trx转usdt</button> -->
        <a-button @click="a.eth_sendTransaction">转账</a-button>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';

import Web3 from 'web3'

let ethereum = (window as any)?.ethereum
// 创建一个 Web3 实例，并指定当前提供商
const web3 = new Web3(ethereum);

// // 设置合约地址和 ABI
// const contractAddress = '0xabcdef123456...';
// const contractABI = [...]; // 合约 ABI

// // 设置 MetaMask 当前账户
// const fromAccount = web3.eth.accounts.wallet[0].address;

// // 设置兑换参数
// const amount = web3.utils.toWei('1', 'ether'); // 兑换数量
// const toAddressA = '0xAAAAAAAAAAAAAAAA...'; // 转账目标地址 A
// const toAddressB = '0xBBBBBBBBBBBBBBBB...'; // 转账目标地址 B

// // 创建合约实例
// const contract = new web3.eth.Contract(contractABI, contractAddress);

// // 获取兑换方法
// const exchangeMethod = contract.methods.exchange(toAddressA, amount).encodeABI();

// // 发送交易
// web3.eth.sendTransaction({
//   from: fromAccount,
//   to: contractAddress,
//   data: exchangeMethod
// })
// .then(txHash => {
//   console.log('兑换交易已发送，交易哈希：', txHash);
// })
// .catch(error => {
//   console.error('兑换交易发送失败：', error);
// });


class a {
  static eth_sendTransaction(){
    ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0], // 当前活动账号地址
            to: '0x78ee24Dec10b9DE1ae64eF7B0bE20D4c3DFb406E', // 接收方地址
            value: '0x2386f26fc10000', // 以太币金额（0.01 ETH）的十六进制值
            gasLimit: '0x5028', // 燃气限制
            maxPriorityFeePerGas: '0x3b9aca00', // 优先费用上限
            maxFeePerGas: '0x2540be400', // 最大费用上限
          },
        ],
      })
      .then((txHash:any) => {
        console.log('Transaction Hash:', txHash);
      })
      .catch((error:any) => {
        console.error(error);
      });
  }
}

</script>