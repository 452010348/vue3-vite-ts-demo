<template>
  <div style="margin-top: 50px;">
    <p><a href="https://solfaucet.com/">Solana 领币1 无需登录 但又IP限制 (更换IP又可以继续领)</a></p>
    <p><a href="https://faucet.quicknode.com/solana/devnet">Solana 领币2 (领币麻烦)</a></p>
    <p><a href="https://docs.phantom.app/introduction/readme">* solana官网文档</a></p>
    <p><a href="https://solana-labs.github.io/solana-web3.js/classes/Connection.html#getBalance">* solana-web3 文档</a></p>
    <p class="mt-10">公钥：{{ wallet.address }}</p>
    <p class="mb-5">网络：{{ WalletAdapterNetwork.Testnet }}</p>
    <a-button v-if="!wallet.address" @click="connect()">建立连接</a-button>
    <template v-else>
      <a-button @click="disconnect()">断开连接</a-button>
      <a-button @click="getBalance(wallet.address)">获取原生余额</a-button>
      <a-button @click="getToken('Dmu6Lk5AZccmRtnmGmqWA1ZBFAmZFRhRdT6fMonbBLNS')">获取代币余额</a-button>
      <a-button @click="sendSol('FwxC5VwvYoU55mZBynwPu6xs3sdKnWp52UgXvwumWjGK', '0.1')">发送sola</a-button>
      <!-- <a-button @click="sendToken('FwxC5VwvYoU55mZBynwPu6xs3sdKnWp52UgXvwumWjGK', 'Dmu6Lk5AZccmRtnmGmqWA1ZBFAmZFRhRdT6fMonbBLNS', '1')">发送代币</a-button> -->
      <!-- <a-button @click="transferTokens('FwxC5VwvYoU55mZBynwPu6xs3sdKnWp52UgXvwumWjGK', 'Dmu6Lk5AZccmRtnmGmqWA1ZBFAmZFRhRdT6fMonbBLNS', '0.1')">发送代币3</a-button> -->
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { message } from "ant-design-vue"
import { ethers } from 'ethers';
import Web3 from 'web3'
import * as web3 from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import type { PublicKey } from '@solana/web3.js';
import * as splToken from "@solana/spl-token"
import { Buffer } from 'buffer'

const wallet = reactive({
  address: "",
})
let connection:web3.Connection;

/** 检测提供者 */
const getProvider = (solana: string) => {
  if ('phantom' in window) {
    const provider = window?.phantom[solana];
    if (provider?.isPhantom) {
      return provider;
    }
  }
  // window.open('https://phantom.app/', '_blank');
  alert('需要安装插件 https://phantom.app/')
};

let provider = getProvider("solana");
if (provider) {
  provider.on("connect", () => {
    console.log("connected!")
    wallet.address = provider.publicKey.toString()
  });
  provider.on("disconnect", () => {
    console.log("disconnect!")
    wallet.address = ''
  });
  provider.on('accountChanged', (publicKey: PublicKey) => {
    if (publicKey) {
      console.log(`Switched to account ${publicKey.toBase58()}`);
    }
  });
}

/** 建立连接 */
async function connect(){
  provider = getProvider("solana");
  await provider.connect()
  switchingWetwork()
  wallet.address = provider.publicKey.toString()
  console.log(wallet.address)
  console.log(provider)
  console.log(web3.LAMPORTS_PER_SOL)
}

/** 断开连接 */
async function disconnect() {
  await provider.disconnect();
}

/** 切换网络 */
function switchingWetwork(){
  const rpcUrl = web3.clusterApiUrl(WalletAdapterNetwork.Testnet);
  connection= new web3.Connection(rpcUrl);
}

/** 获取余额 */
async function getBalance(fromAddress: string) {
  const publicKey = new web3.PublicKey(fromAddress);
  let money = await connection.getBalance(publicKey)
  // solana精度 9  注意确认一下！
  money = Number(Number(ethers.formatUnits(money.toString(), 9)).toFixed(4))
  console.log('getBalance', money)
  message.success(money)
}

/** 获取代币余额 */
async function getToken(tokenAddress: string) {
  const tokenPubkey = new web3.PublicKey(tokenAddress);
  const TokenAmount = await connection.getTokenSupply(tokenPubkey)
  console.log('getToken', TokenAmount.value.amount)
  message.success(TokenAmount.value.uiAmountString)
  return TokenAmount
}

/** 发送sol币 */
async function sendSol(toAddress: string, transferAmount: any) {
  const toPubkey = new web3.PublicKey(toAddress)
  // 定义要转移的金额（以lamports为单位）默认长度9
  const lamports = web3.LAMPORTS_PER_SOL * Number(transferAmount);

  async function createTransaction(){
    // 1.构建代表转账的系统交易
    const transaction = new web3.Transaction();
    // 获取最近的区块哈希
    const { blockhash } = await connection.getRecentBlockhash();
    // 设置交易的区块哈希和费用支付者
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = provider.publicKey;
    transaction.add(web3.SystemProgram.transfer({
      fromPubkey: provider.publicKey,
      toPubkey,
      lamports,
    }));
  }

  // 1.构建交易数据
  const transaction = createTransaction()
  // 2.签名
  const signedTransaction = await provider.signTransaction(transaction);
  // 3.发送交易
  const signature = await connection.sendRawTransaction(signedTransaction.serialize())

  //// 签名 并 发送
  // const { signature } = await provider.signAndSendTransaction(transaction)

  // 获取签名的当前状态
  await connection.getSignatureStatus(signature);

  message.success(`交易成功：${signature}`)
};



// // 发送代币
// const sendToken = async (toAddress: string, tokenAddress: string, transferAmount: any) => {
//   // 自己的钱包
//   const fromPubkey = provider._publicKey
//   const toPubkey = new web3.PublicKey(toAddress)
//   const tokenPubkey = new web3.PublicKey(tokenAddress);
//   const programId = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

//   const rpcUrl = web3.clusterApiUrl(WalletAdapterNetwork.Testnet);
//   const connection = new web3.Connection(rpcUrl);

//   const TokenAmount = await connection.getTokenSupply(tokenPubkey)
//   const decimals = TokenAmount.value.decimals

//   // // 定义要转移的金额（以lamports为单位）
//   // const lamports = decimals * Number(transferAmount);
//   // 定义代表要转账的金额以及原生币的精度 （假设精度为 9）
//   // const amount = Number(transferAmount) * 1e9;
//   const amount = ethers.parseUnits(String(transferAmount), decimals).toString()
//   const amountHex = Web3.utils.toHex(amount)

//   // 创建交易指令
//   async function createTransferInstruction() {
//     const data = new web3.TransactionInstruction({
//       keys: [
//         { pubkey: tokenPubkey, isSigner: false, isWritable: true },
//         { pubkey: fromPubkey, isSigner: true, isWritable: false },
//         { pubkey: toPubkey, isSigner: false, isWritable: true },
//       ],
//       programId,
//       data: Buffer.from(amountHex.slice(2), 'hex'),
//     })
//     // 1.构建代表转账的交易
//     const transaction = new web3.Transaction()
//     transaction.add(data)

//     const { blockhash } = await connection.getRecentBlockhash('max');
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = provider.publicKey;
//     return transaction
//   }

//   // 1.构建数据
//   const transaction = await createTransferInstruction()

//   // 2.签名
//   const signedTransaction = await provider.signTransaction(transaction);
//   // 3.发送交易
//   const signature = await connection.sendRawTransaction(signedTransaction.serialize())
//   //  // 2.签名并发送交易
//   // const { signature } = await provider.signAndSendTransaction(transaction);

//   // 检查交易状态
//   await connection.confirmTransaction(signature);
//   console.log('Transaction confirmed:', signature);
// };



// // 代币转账函数
// async function transferTokens(toAddress: string, tokenAddress: string, transferAmount: any) {
//   // 通过 Phantom 钱包连接到 网络 
//   const connection = new web3.Connection(web3.clusterApiUrl(WalletAdapterNetwork.Testnet));

//   async function createTransferInstruction() {
//     const lamportsToSend = web3.LAMPORTS_PER_SOL; // 要发送的代币数量
//     // 自己的钱包
//     const fromPubkey = provider._publicKey
//     const toPubkey = new web3.PublicKey(toAddress)
//     const tokenPubkey = new web3.PublicKey(tokenAddress);
//     const programId = new web3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
//     const owner = new web3.PublicKey('BGRAgVKCszAPQeLGSrAxZ2yKpiphLueqBhAFXFSMFeML')
//     const amount = web3.LAMPORTS_PER_SOL * Number(transferAmount);

//     const data = splToken.createTransferInstruction(
//       fromPubkey,
//       toPubkey,
//       owner,
//       amount,
//       [],
//       programId,
//     )
//     const transaction = new web3.Transaction().add(data);

//     const { blockhash } = await connection.getRecentBlockhash('max');
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = provider.publicKey;
//     return transaction
//   }

//   // 1.构建数据
//   const transaction = await createTransferInstruction()
  
//   // 2.签名
//   const signedTransaction = await provider.signTransaction(transaction);

//   // 3.发送交易
//   const signature = await connection.sendRawTransaction(signedTransaction.serialize())

//   // 检查交易状态
//   await connection.confirmTransaction(signature);
//   console.log('Transaction confirmed:', signature);
// }
</script>
