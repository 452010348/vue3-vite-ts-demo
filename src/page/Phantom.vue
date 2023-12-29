<template>
  <div style="margin-top: 50px;">
    <p><a-link href="https://solfaucet.com/">Solana 领币1 无需登录 但又IP限制 (更换IP又可以继续领)</a-link></p>
    <p><a-link href="https://faucet.quicknode.com/solana/devnet">Solana 领币2 (领币麻烦)</a-link></p>
    <p><a-link href="https://docs.phantom.app/introduction/readme">*开发文档</a-link></p>
    <p><a-link href="https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getBalance">*文档solana-web3</a-link></p>
    <p class="mt-10">公钥：{{ wallet.address }}</p>
    <p class="mb-5">网络：{{ WalletAdapterNetwork.Testnet }}</p>
    <a-button v-if="!wallet.address" @click="connect()">建立连接</a-button>
    <template v-else>
      <a-button @click="disconnect()">断开连接</a-button>
      <a-button @click="getBalance()">获取原生余额</a-button>
      <!-- <a-button @click="getTokenBalance('还不知道')">获取代币余额</a-button> -->
      <a-button @click="sendSol('3patsJTnGmAeMMtT2L5t9pKUw2mj79W8Yho4rh9PDpQu','0.01')">发送交易sola</a-button>
      <a-button @click="signAndSendTransaction()">发送交易</a-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { ethers } from 'ethers';

import { message } from "ant-design-vue"
import * as web3 from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import type { PublicKey } from '@solana/web3.js';

const wallet = reactive({
  address: "",
})


/** 检测提供者 */
const getProvider = (solana:string) => {
  if ('phantom' in window) {
    const provider = window?.phantom[solana];
    if (provider?.isPhantom) {
      return provider;
    }
  }
  // window.open('https://phantom.app/', '_blank');
  alert('需要安装插件 https://phantom.app/')
};
const provider = getProvider("solana");
if (provider) {

  provider.on("connect", () => {
    console.log("connected!")
    wallet.address = provider.publicKey.toString()
  });
  provider.on("disconnect", () => {
    console.log("disconnect!")
    wallet.address = ''
  });
  provider.on('accountChanged', (publicKey:PublicKey) => {
    if (publicKey) {
      console.log(`Switched to account ${publicKey.toBase58()}`);
    }
  });
}
/** 建立连接 */
const connect = async () => {
  // await provider.connect()
  await provider.connect()
  wallet.address = provider.publicKey.toString()
  console.log(wallet.address)
  console.log( provider )
  console.log( web3.LAMPORTS_PER_SOL )
}

/** 断开连接 */
const disconnect = async () => {
  await provider.disconnect();
}

/** 获取余额 */
async function getBalance(){
  const rpcUrl = web3.clusterApiUrl(WalletAdapterNetwork.Testnet)
  const connection = new web3.Connection(rpcUrl);
  let money = await connection.getBalance(provider.publicKey)
  // solana精度 9  注意确认一下！
  money = Number(Number(ethers.formatUnits(money.toString(),9)).toFixed(4))
  console.log('getBalance', money)
  message.success(money)
}

/** 获取代币余额 */
async function getTokenBalance(tokenAddress:PublicKey) {
  const rpcUrl = web3.clusterApiUrl(WalletAdapterNetwork.Testnet)
  const connection = new web3.Connection(rpcUrl);
  let TokenAmount = await connection.getTokenAccountBalance(tokenAddress)
  console.log('getTokenBalance', TokenAmount.value.amount)
  message.success(TokenAmount.value.amount)
}

async function signAndSendTransaction() {
  const rpcUrl = web3.clusterApiUrl(WalletAdapterNetwork.Testnet)
  const connection = new web3.Connection(rpcUrl);
  const transaction = new web3.Transaction();
  const { signature } = await provider.signAndSendTransaction(transaction);
  await connection.getSignatureStatus(signature);
}



const sendSol = async (toPubkey, transferAmount) => {
  // 定义要转移的金额（以lamports为单位）
  const lamports = web3.LAMPORTS_PER_SOL * transferAmount;


  const rpcUrl = web3.clusterApiUrl(WalletAdapterNetwork.Testnet);
  const connection = new web3.Connection(rpcUrl);
  const transaction = new web3.Transaction();

  // 获取最近的区块哈希
  const { blockhash } = await connection.getRecentBlockhash();

  // 设置交易的区块哈希和费用支付者
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = provider.publicKey;
  // const { signature } = await provider.signAndSendTransaction(transaction);
  // await connection.getSignatureStatus(signature);
  
  debugger
  // 构建代表转账的系统交易
  transaction.add(web3.SystemProgram.transfer({
    fromPubkey: provider.publicKey,
    toPubkey,
    lamports,
  }));

  const signedTransaction = await provider.signTransaction(transaction);

  // 签名并发送交易
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());

  // 确认交易
  await connection.confirmTransaction(signature);
  console.log('Transaction confirmed:', signature);









};


const sendToken = async (recipientAddress, transferAmount) => {
  // 选择代表要转账的资产（代币）
  const tokenMintAccountAddress = new web3.PublicKey('<<token mint account address>>');

  // 定义代表要转账的金额以及原生币的精度 （假设精度为 9）
  const amount = transferAmount * 1e9;

  // 构建代表转账的交易
  const transaction = new web3.Transaction().add(
    web3.SystemProgram.transfer({
      fromPubkey: provider.publicKey,
      toPubkey: recipientAddress,
      lamports: amount,
    }),
    web3.SPLToken.createTransferInstruction(
      tokenMintAccountAddress,
      provider.publicKey,
      recipientAddress,
      provider.publicKey,
      [provider.publicKey],
      transferAmount
    )
  );

  // 签名并发送交易
  const rpcUrl = web3.clusterApiUrl(WalletAdapterNetwork.Testnet);
  const connection = new web3.Connection(rpcUrl);
  const { blockhash } = await connection.getRecentBlockhash('max');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = provider.publicKey;
  const { signature } = await provider.signAndSendTransaction(transaction);

  // 检查交易状态
  await connection.confirmTransaction(signature);
  console.log('Transaction confirmed:', signature);
};
</script>
