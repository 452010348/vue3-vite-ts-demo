<template>
    <div>
      <h2>ethereum</h2>

      <div class="flex">
        <!-- <button @click="onClick()">trx转usdt</button> -->
        <!-- <a-button @click="a.eth_sendTransaction">转账</a-button> -->
        <a-button @click="sendETHByMetamask">转账ETH 到</a-button>
        <a-input v-model:value="walletData.address"></a-input>
      </div>
      <div class="flex">
        <a-button @click="swapEth">转账ETH 到</a-button>
        <a-button @click="wb3SwapETH">转账ETH 到</a-button>
      </div>
    </div>
</template>

<script setup lang="ts">
// import axios from 'axios';
import { reactive } from 'vue';
import { ethers } from 'ethers'
import { abi } from "../TronLink/abi"
import Web3 from 'web3'
window.Web3 = Web3;
window.ethers = ethers;

const walletData = reactive({
  address:"0x78ee24Dec10b9DE1ae64eF7B0bE20D4c3DFb406E"
})
let web3:any=null
let provider:any=null 
let ethereum = (window as any)?.ethereum

// 检查是否已连接 MetaMask
if (ethereum) {
} else {
  console.error('Please install MetaMask to access the Ethereum Web3 API.');
}
// 创建以太坊提供者
provider = new ethers.providers.Web3Provider(ethereum);
const signer = provider.getSigner()
const rpc = new ethers.providers.JsonRpcProvider();
console.log(rpc)

// const signedTx = await provider.eth.accounts.signTransaction(transaction, 'YOUR_PRIVATE_KEY');
// ethereum.removeListener('accountsChanged', handleAccountsChanged);
ethereum.on('accountsChanged', (e:any)=>{
console.log( 'accountsChanged', e)
}); 
ethereum.on('chainChanged',(e:any)=>{
console.log( 'chainChanged', e)
})
ethereum.on('connect', (e:any)=>{
console.log( 'connect', e)
});
ethereum.on('disconnect', (e:any)=>{
console.log( 'disconnect', e)
});




// 获取当前活动地址的私钥
const getCurrentProviderWithSigner = async () => {
  // 检查是否安装了 Metamask
  if (typeof ethereum === 'undefined') {
    throw new Error('请先安装 Metamask');
  }
  // 请求用户授权
  await ethereum.enable();
}

const sendETHByMetamask = async () => {
  const signer = await provider.getSigner()
  const amount = ethers.utils.parseEther('0.001')
  debugger
  const signTx = await signer.sendTransaction({
    to: walletData.address,
    value: amount
  })
  console.log('signTx :>> ', signTx)
  console.log('signTx :>> ', JSON.stringify(signTx,null,2))
}




// d
async function swapEth(){
  try {
    //1. 创建交易：
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();
    const amount = ethers.utils.parseEther('0.001');
    
    const transactionObject = {
      to: walletData.address,
      value: amount
    };
    const createTx = await signer.populateTransaction(transactionObject);
    console.log('创建交易:>>',  createTx);
    console.log( signer.signTransaction )
    //2. 签名交易：
    const signedTx = await signer.signTransaction(createTx)
    console.log('签名交易:>>', signedTx);
    
    
    //3. 广播交易（发送已签名的交易）：
    const broadcastTx = await provider.sendTransaction(signedTx);
    console.log('广播交易:>>', broadcastTx);
  } catch (error) {
    debugger
  }
}



async function wb3SwapETH(){
  const fromAddress = '0xeA5932F2f446ca61D41425FA7a0A560A413a1F0B' //发币地址 
  const toAddress = '0xeA5932F2f446ca61D41425FA7a0A560A413a1F0B' //收币地址 
  const toTokenCode = 'USDT' //收币code 名称 
  const amount = ethers.utils.parseEther('0.001').toString(); // 发币数量  
  const amountOutMin = '53837610794859360000' // 最小得到数量 
  const fromTokenAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // 发送币种合约 
  const ROUTE_ABI = abi // abi json 
  const web3 = new Web3(ethereum); 
  // const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed1.binance.org/')); 
  const ROUTER_ADDRESS = '0x561CDD3184985e5d38bb2d4c41b4c19C938d8cF7'; 
  const routerContract = new web3.eth.Contract(ROUTE_ABI, ROUTER_ADDRESS); 
  let data,value; 
  if('0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'== fromTokenAddress){
    data = routerContract.methods.swapEth(toTokenCode,fromAddress,amountOutMin).encodeABI(); 
    value = Web3.utils.toHex(amount);
  }else{ 
    data = routerContract.methods.swap(fromTokenAddress,toTokenCode,toAddress,amount,amountOutMin).encodeABI(); 
    value = '0x0'; 
  }
  console.log(data,value)
  const privateKey = 'c18bd27b1bb5389cc49a2ff2af992406fa041c04d6cc4b449decb60696110261';
  const signer = new ethers.Wallet(privateKey);
  console.log( signer );
  
  const signedTransaction = await signer.signTransaction({
    to: ROUTER_ADDRESS,
    data: data,
    value: value
  });
  console.log('signedTransaction :>>', signedTransaction)
  await web3.eth.sendSignedTransaction(signedTransaction)
}



</script>