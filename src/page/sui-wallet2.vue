<template>
  <div style="margin-top: 30px;">
    <h2>sui-wallet2 - 水龙头-demo</h2>
    <p>地址：0xd86630746e921676a3c695380114978b854a55e8a6e3006352e27153623db607</p>
    <a-button @click="getBalance('0xd86630746e921676a3c695380114978b854a55e8a6e3006352e27153623db607')">查询余额</a-button>
    <a-button @click="apply('0xd86630746e921676a3c695380114978b854a55e8a6e3006352e27153623db607')">领取1SUi币</a-button>
  </div>
</template>

<script setup lang="ts">
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';
import { MIST_PER_SUI } from '@mysten/sui.js/utils';
import { message } from 'ant-design-vue';


 // 创建一个指向您想要使用的网络的新的SuiClient对象
 const suiClient = new SuiClient({ url: getFullnodeUrl('devnet') });
  
 // 将MIST转换为Sui
 const balance = (balance:any) => {
   return Number.parseInt(balance.totalBalance) / Number(MIST_PER_SUI);
 };
  
 async function getBalance(MY_ADDRESS:string){
   // 在使用水龙头之前存储该地址拥有的SUI的JSON表示
   const suiBefore = await suiClient.getBalance({
     owner: MY_ADDRESS,
   });
   console.log( suiBefore )
   message.success(balance(suiBefore))
 }


 async function apply(MY_ADDRESS:string){
   await requestSuiFromFaucetV0({
     //使用getFaucetHost来确保你使用了正确的水龙头地址
     //你也可以直接使用地址(参见Sui TypeScript SDK Quick Start中的值)
     host: getFaucetHost('devnet'),
     recipient: MY_ADDRESS,
   });
 } 



 debugger
</script>
