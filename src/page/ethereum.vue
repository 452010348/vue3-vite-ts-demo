<template>
  <div>
    <h2>ethereum</h2>
    <p>钱包地址: {{ ethereum?.selectedAddress}}</p>
    {{ ethers.toBeHex('1') }}
    {{ ethers.parseUnits('0.01', 18) }}
    {{ ethers.formatUnits('1000', 3) }}
    {{ web3.utils.toWei('1', 'gwei') }}
    {{ web3.utils.toBN('123000').mul(web3.utils.toBN(2)) }}
    <br>
    <br>
    <div class="flex">
      <a-button @click="swapEth">swapEth</a-button>
      <div>
        <a-input v-model:value="walletData.amount" placeholder="支付金额"></a-input>
      </div>
      <a-input v-model:value="walletData.address" placeholder="接收地址"></a-input>
    </div>
    <div class="flex">
     
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { ethers } from 'ethers';
// import { abi } from '../TronLink/abi';
import Web3 from 'web3'


const ethereum = (window as any)?.ethereum;
const provider = new ethers.BrowserProvider(ethereum);
const web3= new Web3(ethereum);

const walletData = reactive({
  /** 接受地址 */
  address: '0xeA5932F2f446ca61D41425FA7a0A560A413a1F0B',
  /** 支付金额 */
  amount:0.01,
});


ethereum.on('accountsChanged', (e: any) => {
  console.log('accountsChanged', e);
});
ethereum.on('chainChanged', (e: any) => {
  console.log('chainChanged', e);
});
ethereum.on('connect', (e: any) => {
  console.log('connect', e);
});
ethereum.on('disconnect', (e: any) => {
  console.log('disconnect', e);
});


async function swapEth() {
  await ethereum.enable()
  const amount = ethers.parseEther('0.1').toString();
  const signer = await provider.getSigner();
  const signTx = await signer.sendTransaction({
    to: walletData.address,
    value: amount,
  });
  console.log( 'signTx >>', JSON.stringify(signTx,null,2) )
}


</script>
