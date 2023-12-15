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
    <div>
      <p>原生币：扫码支付：{{ text1 }}</p>
      <img :src="qrcode1" alt="QR Code" />
    </div>
    <div style="margin-top: 300px;">
      <p>原生币：扫码支付：{{ text2 }}</p>
      <img :src="qrcode2" alt="QR Code" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { ref, reactive } from 'vue';
import { ethers } from 'ethers';
// import { abi } from '../TronLink/abi';
import Web3 from 'web3'

// 原生币
const code1 = qrCode({
  amount:"0.01",
  toAddress:'0xdEfB419bf2DE2852126b155671e5cd201B30Fe96',
  tokenAddress:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  decimal:18
})
const text1 = ref(code1)
const qrcode1 = useQRCode(text1)


// 代币 
const code2 = qrCode({
  amount:"2",
  toAddress:'0xdEfB419bf2DE2852126b155671e5cd201B30Fe96',
  tokenAddress:"0x561CDD3184985e5d38bb2d4c41b4c19c938d8cF7",//USDT
  decimal:6
})
const text2 = ref(code2)
const qrcode2 = useQRCode(text2)
// const qrcode2 = useQRCode('ethereum:0x561cdd3184985e5d38bb2d4c41b4c19c938d8cf7/transfer?address=0xfDEAB4C507eF553e8EEEd3B38e63AEBd9f611302&uint256=10700000')






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

/** 获取二维码地址 */
function qrCode(params:{
  amount:string,
  toAddress:string,
  tokenAddress:string,
  decimal:number
}){
  const amount = ethers.parseUnits(String(params.amount), params.decimal)
  return /^0xe+$/.test(params.tokenAddress) ?
    // 原生币
    `ethereum:${params.toAddress}?value=${amount.toString()}`: 
    // 代币
    `ethereum:${params.tokenAddress}/transfer?address=${params.toAddress}&uint256=${amount.toString()}`
}



// const usdt = {
//   symbol: 'USDT',
//   address: '0x561cdd3184985e5d38bb2d4c41b4c19c938d8cf7',
//   decimal: 6
// }
// const usdc = {
//   symbol: 'USDC',
//   address: '0x893e172174ab342c71cbabe42b94b7fadc89af65',
//   decimal: 6
// }
// const bnb = {
//   symbol: 'BNB',
//   address: '0x43a9e1b3BDc6D2C4271e1cB0D2e534F8CbCDbe5E',
//   decimal: 18
// }
// const busd = {
//   symbol: 'BUSD',
//   address: '0xb5e62910dbcc21a3e1d79ac73581a43e19720743',
//   decimal: 18
// }
</script>
