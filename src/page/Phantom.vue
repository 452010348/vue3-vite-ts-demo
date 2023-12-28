<template>
  <div style="margin-top: 50px;">
    <p><a href="https://solfaucet.com/">Solana 领币1</a></p>
    <p><a href="https://faucet.quicknode.com/solana/devnet">Solana 领币2</a></p>
    <p>公钥：{{ wallet.address }}</p>
    <a-button @click="connect()">连接</a-button>
    <a-button @click="disconnect()">断开连接</a-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
// import { ethers } from 'ethers';
// import Web3 from 'web3'
// import { message } from "ant-design-vue"


const wallet = reactive({
  address:"",
})

/** 检测提供者 */
const getProvider = () => {
  if ('phantom' in window) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
  // window.open('https://phantom.app/', '_blank');
  alert('需要安装插件 https://phantom.app/')
};

const provider = getProvider();
provider.on("connect", ({ publicKey }) => {
  console.log("connected!")
  console.log(publicKey)
  wallet.address = publicKey.toString()
});
provider.on("disconnect", () => {
  console.log("disconnect!")
  wallet.address = ''
});
/** 建立连接 */
const connect = async () => {
  await provider.connect({ onlyIfTrusted: true })
  console.log(provider.publicKey.toString())
  return provider

}
const disconnect = async () => {
  await provider.disconnect();
}

// // 获取 eth 余额
// async function getBalance(){
//   client.getBalance('ETH').then((balance:any) => {
//     console.log(`当前账户 ETH 余额为：${balance}`);
//     message.success(balance)
//   }).catch((error:any) => {
//     console.error('获取余额时出错', error);
//   });
// }

// async function getTokenBalance() {
//   const tokenAddress = '0x...'; // 代币合约地址
//   // 获取代币余额
//   client.getTokenBalance(tokenAddress).then((balance:any) => {
//     console.log(`当前账户代币余额为：${balance}`);
//     message.success(balance)
//   }).catch((error:any) => {
//     console.error('获取代币余额时出错', error);
//   });
// }
</script>
