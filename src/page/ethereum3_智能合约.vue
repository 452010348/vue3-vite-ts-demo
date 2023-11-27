<template>
  <div>
    <h2>ethereum3</h2>
    <a-button @click="aa.allowance">allowance</a-button>
  </div>
</template>

<script setup lang="ts">
// 引入 Web3.js 库和相关依赖
const Web3 = require('web3');
const { abi: uniswapRouterAbi } = require('./path/to/uniswapV2Router.json');  // Uniswap V2 Router 合约 ABI
const { ethers } = require('ethers');  // ethers.js 库

// 创建一个 Web3 实例
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');  // 替换为自己的 Infura 项目 ID

// 定义相关参数
const privateKey = 'YOUR_PRIVATE_KEY';  // 替换为您自己的以太坊账户的私钥
const walletAddress = 'YOUR_WALLET_ADDRESS';  // 替换为您自己的以太坊账户地址
const uniswapRouterAddress = 'UNISWAP_ROUTER_ADDRESS';  // 替换为 Uniswap V2 Router 合约的地址
const ethAmount = web3.utils.toWei('1', 'ether');  // 要兑换的 ETH 数量（单位为 Wei）

// 创建一个以太坊钱包
const wallet = new ethers.Wallet(privateKey);

// 使用钱包连接到以太坊网络
const provider = new ethers.providers.InfuraProvider('mainnet', 'YOUR_INFURA_PROJECT_ID');  // 替换为自己的 Infura 项目 ID
const connectedWallet = wallet.connect(provider);

// 获取 Uniswap V2 Router 合约实例
const uniswapRouter = new web3.eth.Contract(uniswapRouterAbi, uniswapRouterAddress);

// 交易函数
async function swapETHToUSDT() {
  // 构建交易参数
  const path = [web3.utils.toChecksumAddress('ETH_ADDRESS'), web3.utils.toChecksumAddress('USDT_ADDRESS')];  // 替换为对应代币的地址
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;  // 设置 deadline，确保交易在指定时间内完成
  const amountOutMin = 0;  // 设置期望最小输出数量

  // 构建调用合约的数据
  const txData = uniswapRouter.methods.swapExactETHForTokens(
    amountOutMin,
    path,
    walletAddress,
    deadline
  ).encodeABI();

  // 获取以太坊当前的 gas 价格
  const gasPrice = await web3.eth.getGasPrice();

  // 构建交易对象
  const transactionObject = {
    from: walletAddress,
    to: uniswapRouterAddress,
    value: ethAmount,
    gasPrice: gasPrice,
    gas: 300000  // 设置 gas 数量，根据具体情况调整
  };

  // 使用钱包对交易进行签名
  const signedTransaction = await connectedWallet.signTransaction(transactionObject);

  try {
    // 发送交易
    const receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    console.log('Transaction receipt:', receipt);
  } catch (error) {
    console.error('Failed to send transaction:', error);
  }
}

// 执行交易函数
swapETHToUSDT();
</script>
