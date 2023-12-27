<script setup lang="ts">
//测试网
import { sepolia, lineaTestnet } from 'viem/chains'
//正式网
// import { bsc } from '@wagmi/core/chains';

import Web3 from 'Web3'
// import * as chains_A from 'viem/chains'
import * as core from "@wagmi/core"
import * as chainObj from '@wagmi/core/chains';
import {
  configureChains,
  createConfig,
  disconnect,
  erc20ABI,
  fetchBalance,
  fetchFeeData,
  getAccount,
  sendTransaction,
  switchNetwork,
  watchAccount,
  watchNetwork,
  writeContract,
  // readContracts,
} from '@wagmi/core';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';

// const testNet = [sepolia, lineaTestnet]
const chains = [...Object.values(chainObj)];
const projectId = 'a5d19cad465451fb165833a07e1c0162';
debugger
const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);
const web3modal = new Web3Modal({ projectId }, ethereumClient);


// 监听 (锁定 断开 授权 会触发  ， 已连过(openModal) 解锁 不会触发)
watchAccount((data) => {
  console.log('🤡 / watchAccount / data:', data);
});

// 监听 切换链时
watchNetwork((data) => {
  console.log('🤡 / watchNetwork / data:', data);
});


// 监听 app 扫码授权回调
web3modal.subscribeEvents((ev) => {
  console.log('🤡 / web3modal.subscribeEvents / ev:', ev);
});
// 监听WalletConnect弹窗唤起 打开 和 关闭
web3modal.subscribeModal( async (state) => {
  console.log('🤡 / web3modal.subscribeModal / state:', state);
  if (!state.open) {
      web3modal.setDefaultChain(sepolia);
  }
});

// 获取账户
async function myGetAccount() {
  const res = getAccount();
  console.log('🤡 / myGetAccount / res:', res);
}

// 获取余额原生币&代币
async function myGetBalance(contractAddress?: string) {
  const account = getAccount();
  let res = await fetchBalance({ address: account.address!, token: contractAddress as any })
  // let res = await ethereumClient.fetchBalance({address: account.address!,token: contractAddress as any })

  console.log('🤡 / myGetBalance / res:', res);

}

// 转账原生币&代币
async function myTransfer(contractAddress?: string) {
  const toAddress = '0x78BE169B127021fAA12503873AC566D1fd2f746e';

  if (contractAddress) {
    const res = await writeContract({
      abi: erc20ABI,
      address: contractAddress as any,
      functionName: 'transfer',
      args: [toAddress, 10000n],
    });
    console.log('🤡 / myTransfer / res:', res);
  }
  else {
    const gas = await fetchFeeData();
    console.log('🤡 / myTransfer / gas:', gas);
    const res = await sendTransaction({
      to: toAddress,
      value: 100000000000000n,
      gasPrice: gas.gasPrice!,
    });
    console.log('🤡 / myTransfer / res:', res);
  }
}

class user {
  static switchNetwork(obj:{chainId:number}){
    ethereumClient.switchNetwork(obj)
    const chain = Object.values(chainObj).find((el)=>{return Number(el.id)===Number(chainId)})
    web3modal.setDefaultChain( chain )
  }
}



</script>

<template>
  <div>
    <fieldset>
      <legend>
        <h1>WalletConnectHtml</h1>
      </legend>
      <section>
        <a-button @click="web3modal.openModal({ chains })">连接</a-button>
        <a-button @click="disconnect()">断连</a-button>
        <a-button @click="switchNetwork({ chainId: 137 })">切换到网络</a-button>
        <a-button @click="user.switchNetwork({ chainId: 592 })">切换到网络</a-button>
      </section>
    </fieldset>
    <fieldset>
      <legend>
        <h1>WalletConnectHtml</h1>
      </legend>
      <section>
        <a-button @click="myGetAccount()">获取账户</a-button>
        <a-button @click="myGetBalance()">获取原生</a-button>
        <a-button @click="myGetBalance('0x561CDD3184985e5d38bb2d4c41b4c19C938d8cF7')">获取代币</a-button>
        <a-button @click="myTransfer()">转账原生</a-button>
        <a-button @click="myTransfer('0x561CDD3184985e5d38bb2d4c41b4c19C938d8cF7')">转账代币</a-button>
      </section>
    </fieldset>
    <fieldset>
      <legend>
        <h1>core 对象</h1>
      </legend>
      <section>
        <a-tag style="margin:5px" color="cyan" v-for="item in Object.keys(core)">{{ item }}</a-tag>
      </section>
    </fieldset>
    <fieldset>
      <legend>
        <h1>ethereumClient 对象</h1>
      </legend>
      <section>
        <a-tag style="margin:5px" color="cyan" v-for="item in Object.keys(ethereumClient)">{{ item }}</a-tag>
      </section>
    </fieldset>
    <fieldset>
      <legend>
        <h1>web3modal 对象</h1>
      </legend>
      <section>
        <a-tag style="margin:5px" color="cyan" v-for="item in Object.keys(web3modal)">{{ item }}</a-tag>
      </section>
    </fieldset>
    <fieldset>
      <legend>
        <h1>chains</h1>
      </legend>
      <section>

        <a-table :columns="[
          { title: 'id', dataIndex: 'id', },
          { title: 'network', dataIndex: 'network', },
          { title: 'nativeCurrency', dataIndex: 'nativeCurrency', },
          { title: 'rpc', dataIndex: 'rpcUrls', },
          { title: 'blockExplorers', dataIndex: 'blockExplorers', },
        ]" :data-source="Object.values(chainObj)" bordered>

          <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'nativeCurrency'">
              <a>{{ text }}</a>
            </template>
            <template v-if="column.dataIndex === 'rpcUrls'">
              <i>{{ text.public.http[0] }}</i>
            </template>
            <template v-if="column.dataIndex === 'blockExplorers'">
              <a :href="text?.default?.url" target="_blank">{{ text?.default?.url }}</a>
            </template>
          </template>
        </a-table>
        <ul>
          <li v-for="item in Object.values(chainObj)">
            <b style="width: 150px;display: inline-block;">{{ item.id }}</b>
            <b style="width: 250px;display: inline-block;">{{ item.network }}</b>
            <i style="width: 600px;display: inline-block;">{{ item.nativeCurrency }}</i>
            <u style="width: 600px;display: inline-block;">{{ item.rpcUrls.public.http[0] }}</u>
            <!-- <a :href="item?.blockExplorers?.default?.url" target="_blank">blockExplorers</a> -->
            <u>{{item?.blockExplorers?.default?.url}}</u>
          </li>
        </ul>
      </section>
    </fieldset>
  </div>
</template>



