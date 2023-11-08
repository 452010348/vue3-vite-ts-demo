<template>
    <div style="margin-top: 50px;">
        <button @click="getTronWeb">
            <p>如果用户连接过此 DApp， 则可以直接获取tronLink.tronWeb 。</p>
            <p>如果未连接过，则可以调用请求连接后获取。</p>
       </button>
        <br>
        <button @click="sendTrx()">普通转账</button>
        <button @click="getBalance()">获取金额</button>
        <button @click="getBlockByNumber(2)">获取网络ID</button>
        <button @click="getAccount()">getAccount</button>

        <!-- <button @click="transfer()">trx转usdt</button>
        <button @click="fetchBalance()">获取USDT余额</button> -->
        <button @click="sendTrxToUsdt(200,'TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq')">STR->USDT,自己到钱包1</button>
        <button @click="sendTrxToUsdt(200,'TVpx8mkt7CjmZ8VQdmgAZDF6tMtLfKCL1h')">STR->USDT,自己到钱包2</button>
    </div>
</template>

<script lang="ts">
// /**
//  * 获取币种余额 USDT
//  * @param address 账户地址
//  * @param chainId 链ID
//  * @param symbol 代币 Symbol，默认为 TRX
//  */
// async function  () {
//     // let address = tronLink.tronWeb.defaultAddress.base58;
//     let address = 'TVpx8mkt7CjmZ8VQdmgAZDF6tMtLfKCL1h';
//     // let symbol = ['TRX','USDT'][1]
//     const contractAddress = tokens['USDT'][TronChainId.Nile]
//     const contract = await tronWeb?.contract().at(contractAddress)
//     const res = await contract!.balanceOf(address).call()
//     const balance = Number(res) / 10 ** 6
//     console.log(address, balance );
//     return balance;
// }
/*

export const tronScanGatewayByChainId = new Map<string, string>([
  [TronChainId.Main, 'https://apilist.tronscanapi.com/api'],
  [TronChainId.Nile, 'https://nileapi.tronscan.org/api'],
])
import { tronGridGatewayByChainId } from '../TronLink/constants';
export const tronGridGatewayByChainId = new Map<string, string>([
  [TronChainId.Main, 'https://api.trongrid.io'],
  [TronChainId.Nile, 'https://nile.trongrid.io'],
])

export const usdtContractAddress = new Map<string, string>([
  [TronChainId.Main, 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'],
  [TronChainId.Nile, 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'],
])

*/
//  Token / Account / Contract / Txn Hash / Block
</script>
<script setup lang="ts">


import { onUnmounted } from 'vue';

const msgsage = (e: any) => {
    //账户消息发生改变
    if (e.data.message && e.data.message.action === "accountsChanged") {
        // handler logic
        console.log('got accountsChanged event', e.data)
    }
    // 网络改变消息
    if (e.data.message && e.data.message.action == "setNode") {
        // handler logic
        console.log('got setNode event', e.data)
    }
    // 连接网站成功消息
    if (e.data.message && e.data.message.action == "connect") {
        // handler logic
        console.log('got connect event', e.data)
    }
    // 断开连接网站消息
    if (e.data.message && e.data.message.action == "disconnect") {
        // handler logic
        console.log('got connect event', e.data)
    }
}
window.addEventListener('message', msgsage);
console.log('组件加载');
// 组件卸载
onUnmounted(() => {
    console.log('组件卸载');
    window.removeEventListener('message', msgsage)
})
const tronLink = (window as any).tronLink
const tronWeb = (tronLink as any).tronWeb;


// 是否支持插件
async function isPlug() {
    try {
        tronLink.tronWeb;
        return Promise.resolve(tronLink);
    } catch (error) {
        console.log('您没有插件 不兼容 之类的提示');
        throw new Error("请先登录TronLink");
    }
}
// 连接
async function getTronWeb() {
    console.log('点击..getTronWeb');
    try {
        await isPlug();
        const res = await tronLink.request({ method: 'tron_requestAccounts' });
        if (res.code === 200) {
            console.log("成功返回：", res);
            return Promise.resolve(tronWeb);
        } else {
            throw new Error("请先登录TronLink");
        }
    } catch (error) {
        console.log('连接异常', error)
        throw error;
    }
}
// 普通转账 trx 转 给trx
async function sendTrx() {
    try {
        await getTronWeb();
        const fromAddress = tronWeb.defaultAddress.base58;
        //const toAddress = "TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq";//钱包1
        const toAddress = "TVpx8mkt7CjmZ8VQdmgAZDF6tMtLfKCL1h";//钱包2
        console.log(fromAddress, toAddress);
        if (fromAddress === toAddress) {
            throw new Error("fromAddress toAddress 相同");
        }
        const tx = await tronWeb.transactionBuilder.sendTrx(toAddress, 100, fromAddress); // 步骤1
        console.log('步骤1', tx);
        const signedTx = await tronWeb.trx.sign(tx); // 步骤2
        console.log('步骤2', signedTx);
        const res = await tronWeb.trx.sendRawTransaction(signedTx); // 步骤3
        console.log('步骤3', res);
        return Promise.resolve(res);
    } catch (error) {
        console.log('error', error);
        throw error;
    }
}
// 获取网络 ID
async function getBlockByNumber(num = 0) {
    try {
        await isPlug();
        const res = await tronLink.tronWeb.trx.getBlockByNumber(num);
        console.log(res);
        let chainId = `0x${res.blockID.slice(-8)}`;
        console.log(chainId);
        return Promise.resolve(chainId)
    } catch (error) {
        console.log(error)
        throw error;
    }
}
// 获取账户
async function getAccount(address=tronLink.tronWeb.defaultAddress.base58){
    try {
        await isPlug();
        const res = await tronLink.tronWeb.trx.getAccount(address);
        console.log( res );
        return Promise.resolve( res );
    } catch (error) {
        console.log( error )
    }
}

// 获取金额
async function getBalance(address:string= tronLink.tronWeb.defaultAddress.base58) {
    try {
        await isPlug();
        const res = await tronLink.tronWeb.trx.getBalance(address);
        const balance = Number(res) / 10 ** 6 ?? 0;
        console.log(address, balance);
        return Promise.resolve(balance);
    } catch (error) {
        console.log(error)
        return Promise.reject(error);
    }
}


// 进行 TRX 到 USDT 的转账   测试后发现 原金额以扣除 但转账后金额一直不到账
async function sendTrxToUsdt(amount:number, toAddress: string) {
  try {
    await getTronWeb();
    await tronWeb.ready;
    const fromAddress = tronWeb.defaultAddress.base58;  // 获取当前地址

    // 获取合约地址
    const usdtContractAddress = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';  // USDT 的合约地址

      // 获取当前地址的 TRX 余额
      const trxBalance = await tronWeb.trx.getBalance(fromAddress);
        console.log( trxBalance );
      // 获取 USDT 合约实例
      const usdtContract = await tronWeb.contract().at(usdtContractAddress);
      
      // 获取 USDT 合约的 decimals（小数位数）
      const decimals = await usdtContract.decimals().call();

      // 计算转换后的 USDT 金额，注意要根据小数位数进行调整
      const usdtAmount = amount * (10 ** decimals);
      if (isNaN(usdtAmount)) {
            throw new Error('Invalid amount. Please provide a valid number.');
        }
      // 构建转账交易
      const transferTransaction = await usdtContract.transfer(toAddress, usdtAmount).send();

      console.log('转账交易成功：', transferTransaction);

      return Promise.resolve(transferTransaction);
  } catch (error) {
      console.log('转账交易失败：', error);
      return Promise.reject(error);
  }
}


</script>
