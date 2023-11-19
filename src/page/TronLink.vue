<template>
  <div>
    <h1>tronLink</h1>
    <a-button :loading="loading" @click="connect" v-if="!address">连接</a-button>
    <template v-else>
      <div>钱包地址：{{ address }}</div>
      <h3>请切换至 Tron Nile 测试完</h3>
      <!-- <a-button :loading="loading" @click="swapEthTronGrid">主网兑换TRX为USDT</a-button>
      USDT 代币合约地址：{{ contractAddressTronGridUSDT }} -->
      <ul>
        <li>USDT 代币合约地址：{{ contractAddress }}</li>
      </ul>

      <div>
        TRX->USDT
        <a-button :loading="loading" @click="swapEth">1.智能合约兑换【swapEth】</a-button>
      </div>

      <br />

      <div>
        USDT->TRX
        <a-button :loading="loading" @click="swapTokens">1.触发智能合约【swapTokens】</a-button>
        <a-button :loading="loading" @click="sign">2.签名</a-button>
        <a-button :loading="loading" @click="sendRawTransaction">3.发送交易</a-button>
        <pre>{{ raw_data }}</pre>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// import axios from 'axios';
import { ref, reactive, toRaw } from 'vue';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters';
import { abi } from '../TronLink/abi';
import { base58checkToHex } from '../utils/helpers';
let tronWeb = (window as any).tronWeb ?? null;
// 主网USDT 合约地址
// const contractAddressTronGridUSDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

const adapter = new TronLinkAdapter({ openTronLinkAppOnMobile: false, openUrlWhenWalletNotFound: false });
// 钱包地址
const address = ref(tronWeb?.defaultAddress?.base58 ?? '');
// USDT代币合约地址
const contractAddress = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';
// 签名数据
const raw_data = reactive({
  transaction: '',
  signedTx: '',
  broastTx: '',
});
const loading = ref(false);
async function connect() {
  loading.value = true;
  try {
    if (!tronWeb) {
      throw new Error('请先安装TronLink钱包插件');
    }
    await adapter.connect();
    console.log('address :>> ', adapter.address);
    address.value = adapter.address;
  } catch (error) {
    console.log('error :>> ', error);
  }
  loading.value = false;
}

async function swapEth() {
  loading.value = true;
  // 获取合约实例
  const contractInstance = await tronWeb.contract(abi, contractAddress);
  console.log('>>>', contractInstance);
  // 兑换TRX为USDT
  const tokenFrom = 'TRX';
  const tokenTo = 'USDT';
  const amount = 100; // 兑换数量，这里是100个TRX
  try {
    const tx = await contractInstance.swapEth(tokenFrom, tokenTo, amount).send();
    console.log('>>>兑换成功', tx);
  } catch (error) {
    console.log('>>>兑换失败:', error);
  }
  loading.value = false;
}
//1. 触发智能合约 (创建构建都一个意思)
async function swapTokens() {
  loading.value = true;
  const params = {
    /** TRON 路由器智能合约的地址 */
    tronRouterAddrees: base58checkToHex('TSv6HwXSx6zTSBa8YyyN9k22PrjuaPXocj').toUpperCase(),
    /** 要调用的智能合约的函数名 */
    functionName: 'swapEth(string,string,uint256)',
    /** 包含一些可选交易选项的对象，例如手续费限制和交易价值等。 */
    options: {
      feeLimit: 1000000000,
      callValue: `0x${Number(30 * 10 ** 6).toString(16)}`,
    },
    /** 作为输入传递给函数的参数对象的数组。数组中的每个对象都需要指定一个类型和一个值。 */
    parameter: [
      {
        type: 'string',
        value: 'USDT',
      },
      {
        type: 'string',
        value: '0x3CC7C99a9cB36d21c9a92e7d7119E680a021ABCD',
      },
      {
        type: 'uint256',
        value: '0x1108f4bf15cac0000',
      },
    ],
    // 执行交易的发起人地址。
    fromAddress: base58checkToHex('TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq').toUpperCase(),
  };
  const arr = [params.tronRouterAddrees, params.functionName, params.options, params.parameter, params.fromAddress];
  let transaction = await tronWeb.transactionBuilder.triggerSmartContract(...arr);
  raw_data.transaction = transaction.transaction;
  console.log('transaction :>>>', transaction);
  loading.value = false;
}
// // 1. 触发智能合约 (创建构建都一个意思)
// async function swapTokens() {
//   loading.value = true;
//   raw_data.transaction = '';
//   raw_data.signedTx = '';
//   raw_data.broastTx = '';
//   // 设置交易参数
//   // const tokenAddress = contractAddress; // 输入代币合约地址
//   /** TRON 路由器智能合约的地址  */
//   const tokenAddress = base58checkToHex('TSv6HwXSx6zTSBa8YyyN9k22PrjuaPXocj').toUpperCase();
//   const amount = 10 * 10 ** 6; // 10 个输入代币
//   const outputTokenAddress = 'TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq'; // 输出代币合约地址
//   const minAmountOut = 1; // 输出代币的最小数量
//   const toAddress = 'TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq'; // 接收交易输出代币的地址
//   try {
//     let transaction = await tronWeb.transactionBuilder.triggerSmartContract(
//       tokenAddress,
//       'swap(uint256,address,uint256,address)',
//       8 * 10 ** 6, // 设置 TRX 燃料费
//       `0x${Number(9 * 10 ** 6).toString(16)}`, //金额
//       [
//         {
//           type: 'uint256',
//           value: amount,
//         },
//         {
//           type: 'address',
//           value: outputTokenAddress,
//         },
//         {
//           type: 'uint256',
//           value: minAmountOut,
//         },
//         {
//           type: 'address',
//           value: toAddress,
//         },
//       ],
//       toAddress
//     );
//     raw_data.transaction = transaction.transaction;
//     console.log('transaction :>>>', transaction);
//   } catch (error) {
//     console.log('transaction :>>>', error);
//   }
//   loading.value = false;
// }
// 2.签名
async function sign() {
  loading.value = true;
  try {
    let signedTx = await tronWeb.trx.sign(toRaw(raw_data.transaction));
    raw_data.signedTx = signedTx;
    console.log('signedTx :>>>', signedTx);
  } catch (error) {
    console.log('>>>', error);
  }
  loading.value = false;
}
// 3.发送交易
async function sendRawTransaction() {
  loading.value = true;
  try {
    let broastTx = await tronWeb.trx.sendRawTransaction(raw_data.signedTx);
    raw_data.broastTx = broastTx;
    console.log('broastTx :>>> ', broastTx);
  } catch (error) {
    console.log('broastTx :>>>', error);
  }
  loading.value = false;
}
</script>
