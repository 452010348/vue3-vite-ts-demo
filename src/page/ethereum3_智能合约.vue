<template>
  <div>
    <h2>ethereum3</h2>
    <a-button @click="aa.allowance">allowance</a-button>
  </div>
</template>

<script setup lang="ts">
// 导入 ethers.js 库
// import { axios } from 'axios';
import { ethers } from 'ethers';
import { abi } from '../TronLink/abi';

const erc20aABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
];
let ethereum = (window as any).ethereum;
class aa {
  static async allowance() {
    const walletAddress = '0x6F14653a91AC36935bdB15db6ccC66dC57593653'; // wallet address
    const contractAddress = '0x1ed5685f345b2fa564ea4a670de1fde39e484751'; //contract address
    const tokenContract = '0x55d398326f99059ff775485246999027b3197955'; //token contract   居然是钱包地址
    const provider = new ethers.providers.Web3Provider(ethereum, 'any');
    const contract = new ethers.Contract(tokenContract, abi, provider);
    debugger;
    const fromNumber = 100; // 100 as a comparison quantity
    contract
      .allowance(walletAddress, contractAddress)
      .then((allowAmt) => {
        contract.allowance;
        console.log(allowAmt);
        // const num = new BigNumber(
        //  ethers.utils.formatUnits(allowAmt, 18),
        // )
        // const fromTokenNum = new BigNumber(fromNumber)
        // console.log(num.toString())
        // console.log(fromTokenNum.toString())
        // if (num.gt(fromTokenNum)) {
        //     console.log('don`t need Approved')
        // } else {
        //     console.log('need Approved')
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
</script>
