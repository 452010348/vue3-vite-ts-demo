<template>
    <div style="margin-top: 50px;">

        <Button @click="USDT()"> USDT</Button>
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
            console.log("成功返回：", res);
            const res2 = await (window as any).tron.request({ method: 'eth_requestAccounts' })
            return Promise.resolve(res2);
        } else {
            throw new Error("请先登录TronLink");
        }
    } catch (error) {
        console.log('连接异常', error)
        throw error;
    }
}
async function USDT(){
    const usdtContractAddress = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf';//'USDT 合约地址';
    const amount = 1; // 转账金额
    const recipient = 'TXR4hiTCniVHKhWbe6ps9wNaGRxw28isPo';//'收款方地址';
    // 使用TronLink或其他工具提供的钱包地址，进行转账操作
    try {
        const usdtContract = await (window as any).tron.tronWeb.contract().at(usdtContractAddress);
      await usdtContract.transfer(recipient, amount).send();
      console.log('USDT 转账成功');
    } catch (error) {
      console.error('USDT 转账失败：', error);
    }
}


</script>
