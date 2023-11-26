<template>
  <div>
    <h2>ethereum3_Sepolia</h2>
    <a-button @click="connect()" v-if="!ethereum.selectedAddress">连接钱包</a-button>
    <template v-else>
      <p>钱包列表：{{ walletList }}</p>
      <p>当前钱包：{{ selectedAddress }}</p>
      <p>链id：{{ chainId }}</p>
      <p>SepoliaETH: {{ balance }}</p>

      <pre>{{ USDT }}</pre>
      <a-button @click="getBalance(USDT)">获取USDT代币余额</a-button>
      <a-button @click="sendEthTransaction('0x08F22af71a3768DeD20483D7e2309B3a3529a40d', '0.01')">发送交易</a-button>
      <a-button @click="sigMsg()">对消息进行签名</a-button>
    </template>
  </div>
</template>

<script setup lang="ts">
// rpc    https://sepolia.infura.io/v3/
// 链 ID   11155111
// 区块浏览器 URL  https://sepolia.etherscan.io
// 货币符号 SepoliaETH

// LineaETH测试网领币地址： https://www.infura.io/faucet/linea
// sepolia测试网领币地址： https://www.infura.io/faucet/sepolia
//每个测试网转转移币种demo https://faucets.chain.link/kovan

// import { axios } from 'axios';
import { ethers, parseEther } from 'ethers';
import { reactive, ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
// import { abi } from '../TronLink/abi.js';

const ethereum = (window as any).ethereum;
/** 代币 */
const USDT = reactive({
  name: 'USDT',
  address: '0xa1d7f71cbbb361a77820279958bac38fc3667c1a',
  balance: '0',
  decimal: 6,
  chainId: '11155111',
});
const walletList = ref([]);
const selectedAddress = ref('');
const balance = ref<any>('');
const chainId = ref<any>('');
/** 用户相关 */

let provider = new ethers.BrowserProvider(ethereum);
console.log('>>', provider);
if (ethereum.selectedAddress) {
  connect();
}

async function connect() {
  try {
    // 请求用户授权
    walletList.value = await ethereum.enable();
    selectedAddress.value = ethereum.selectedAddress;
    // 获取该地址的余额
    balance.value = await provider.getBalance(ethereum.selectedAddress).then((res) => ethers.formatEther(res));
    // 获取该地址的一些其他信息
    chainId.value = await provider.getNetwork().then((res) => String(res.chainId));
    console.log('>> userList', walletList.value);
    console.log('>> selectedAddress', selectedAddress.value);
    console.log('>> 当前钱包余额：', balance.value);
    console.log('>> chainId', chainId.value);
  } catch (error) {
    console.log('>> 找不到适合的以太坊 Provider', error);
  }
}
interface tokenType {
  name: string;
  address: string;
  balance: string;
  decimal: number;
}
// 获取代币余额
async function getBalance(token: tokenType) {
  const abi = [
    'function decimals() view returns (string)',
    'function symbol() view returns (string)',
    'function balanceOf(address addr) view returns (uint)',
  ];
  try {
    const contract = new ethers.Contract(token.address, abi, provider);
    token.balance = await contract
      .balanceOf(selectedAddress.value)
      .then((res) => String(Number(ethers.formatUnits(res, token.decimal))));

    console.log('>> token.balance', token.balance);
  } catch (error: Error | any) {
    console.error('>> getBalance', error);
    message.error(error.message || '获取余额失败');
  }
}

// 发送交易 ETH原生币
async function sendEthTransaction(toAddress: string, amount = '0') {
  let signer = await provider.getSigner();
  //发送事务时，该值为wei，所以parseEther
  //将ether转换为wei。
  let tx = await signer.sendTransaction({
    to: toAddress,
    value: parseEther(amount),
  });
  console.log('tx :>> ', tx);
  // 通常，您可能希望等到事务被挖掘
  let receipt = await tx.wait();
  console.log('receipt :>> ', receipt);
}

// Signing Messages 对消息进行签名
async function sigMsg() {
  try {
    let id = ethers.id('test');
    // 0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658
    // 我们的签名者;签名消息不需要提供者
    let signer = new ethers.Wallet(id);
    // Wallet {
    //   address: '0xC08B5542D177ac6686946920409741463a15dDdB',
    //   provider: null
    // }
    let message = 'sign into ethers.org?';
    // 签名消息
    let sig = await signer.signMessage(message);
    // '0xefc6e1d2f21bb22b1013d05ecf1f06fd73cdcb34388111e4deec58605f3667061783be1297d8e3bee955d5b583bac7b26789b4a4c12042d59799ca75d98d23a51c'
    // 验证消息;注意地址与签名者匹配
    let a = ethers.verifyMessage(message, sig);
    // 0xC08B5542D177ac6686946920409741463a15dDdB
    console.log('>>id', id);
    console.log('>>signer', signer);
    console.log('>>sig', sig);
    console.log('>>a', a);
  } catch (error) {
    console.error('>> error', error);
  }
}

// let TokenABI = [
// 'function exchangeToken(address _to, uint256 _value) external returns (bool);'
// ]
// // let tx = new ethers.Transaction();
// // console.log('>>tx', JSON.stringify(tx, null, 2));
// // debugger;

// // 构造交易参数
// const txParams = {
//   gasLimit: 600000,
//   value: ethers.parseEther('0.1'),
// };
// // 创建一个合约实例
// const Token = new ethers.Contract(tokenAddress, TokenABI, wallet);
// // 调用合约（exchangeToken 函数）进行交易
// const tx = await Token.exchangeToken(toAddress, exchangeValue, txParams);

// // 使用钱包签名交易
// const signedTx = await new ethers.wallet.sign(tx);

// // 发送交易到以太坊网络
// const txHash = await provider.sendTransaction(signedTx);
</script>
