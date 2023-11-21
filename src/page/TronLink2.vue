<template>
  <div style="margin-top: 50px">
    <Button @click="USDT()"> USDT</Button>
    <Button @click="approveToken()"> approveToken</Button>
    <Button @click="allowance()"> allowance</Button>
  </div>
</template>

<script setup lang="ts">
getTronWeb();
// 连接
async function getTronWeb() {
  console.log('点击..getTronWeb');
  try {
    // await isPlug();
    const res = await (window as any).tronLink.request({ method: 'tron_requestAccounts' });
    if (res.code === 200) {
      console.log('成功返回：', res);
      const res2 = await (window as any).tron.request({ method: 'eth_requestAccounts' });
      return Promise.resolve(res2);
    } else {
      throw new Error('请先登录TronLink');
    }
  } catch (error) {
    console.log('连接异常', error);
    throw error;
  }
}
async function USDT() {
  const usdtContractAddress = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'; //'USDT 合约地址';
  const amount = 1; // 转账金额
  const recipient = 'TXR4hiTCniVHKhWbe6ps9wNaGRxw28isPo'; //'收款方地址';
  // 使用TronLink或其他工具提供的钱包地址，进行转账操作
  try {
    const usdtContract = await (window as any).tron.tronWeb.contract().at(usdtContractAddress);
    const signedTransaction = await usdtContract.transfer(recipient, amount).send();
    // 发送交易
    return (window as any).tron.tronWeb.trx.sendRawTransaction(signedTransaction);
  } catch (error) {
    console.error('USDT 转账失败：', error);
  }
}
// 测试 仅 trx
async function sendTransaction(toAddress: string, amount: any) {
  debugger;
  try {
    const tronWeb = (window as any).tronWeb;
    // 创建订单
    const transaction = await tronWeb.transactionBuilder.sendTrx(
      toAddress,
      tronWeb.toSun(amount),
      tronWeb.defaultAddress.base58
    );
    // 引导用户签名
    const signedTransaction = await tronWeb.trx.sign(transaction, tronWeb.defaultAddress.base58);
    // 发送交易
    return tronWeb.trx.sendRawTransaction(signedTransaction);
  } catch (error) {
    console.error(`Error sending transaction: ${error}`);
    debugger;
    return Promise.reject(error);
  }
}
// /**
//  * 合约地址授权
//  * @param {String} contractAddress 定义合约地址和合约 TEorZTZ5MHx8SrvsYs1R3Ds5WvY1pVoMSA
//  * @param {String} approve_address approve_address地址 0x1234567890abcdef1234567890abcdef12345678
//  * @param {Number | String} amount 金额
//  * @returns {Promise}
//  */
// async function approveToken(approve_address: string, contractAddress: string, amount: any) {
//   try {
//     // 初始化 TRON 智能合约实例
//     const contract = await this.tron?.tronWeb.contract().at(contractAddress);
//     // 调用合约的 "approve" 函数来授权代币  定义授权代币的方法
//     return contract.approve(approve_address, amount).send();
//   } catch (error) {
//     return Promise.reject(error);
//   }
// }
// 授权代币的转移
async function approveToken() {
  // 币种合约地址
  const token_address = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';
  // 用钱人钱包地址
  const to_address = 'TXR4hiTCniVHKhWbe6ps9wNaGRxw28isPo';
  // 授权金额
  const amount = 1;
  try {
    // 初始化 TRON 智能合约实例
    const contract = await (window as any).tron?.tronWeb.contract().at(token_address);
    // 调用合约的 "approve" 函数来授权代币  定义授权代币的方法
    return contract.approve(to_address, amount).send();
  } catch (error) {
    console.error('授权代币的转移', error);
    return Promise.reject(error);
  }
}
async function allowance(owner_address: string, spender_address: string) {
  // 币种合约地址
  const token_address = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';
  // 用钱人钱包地址
  const to_address = 'TXR4hiTCniVHKhWbe6ps9wNaGRxw28isPo';
  const from_address = 'TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq';
  try {
    // 初始化 TRON 智能合约实例
    const contract = await window.tron?.tronWeb.contract().at(token_address);
    // 调用合约的 "approve" 函数来授权代币  定义授权代币的方法
    const aa = await contract.allowance(to_address, from_address).call();
    console.log(aa);
    debugger;
  } catch (error) {
    debugger;
    return Promise.reject(error);
  }
}
</script>
