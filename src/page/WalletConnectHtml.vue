<script setup lang="ts">

// import * as chains_A from 'viem/chains'
// import * as core from "@wagmi/core"
import * as chainObj from '@wagmi/core/chains';
console.log( Object.values(chainObj) )
debugger

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

//测试网
import { sepolia, lineaTestnet} from 'viem/chains'
//正式网
import { bsc } from '@wagmi/core/chains';

import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/html';


debugger

const testNet = [sepolia, lineaTestnet]
const chains = [bsc, ...testNet];
const projectId = 'a5d19cad465451fb165833a07e1c0162';

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);
const web3modal = new Web3Modal({ projectId }, ethereumClient);

watchAccount((data) => {
  console.log('🤡 / watchAccount / data:', data);
});

watchNetwork((data) => {
  console.log('🤡 / watchNetwork / data:', data);
});
// setTimeout(() => {
//   web3modal.setDefaultChain(mainnet);
// }, 1000);
web3modal.subscribeEvents((ev) => {
  console.log('🤡 / web3modal.subscribeEvents / ev:', ev);
});

web3modal.subscribeModal((state) => {
  console.log('🤡 / web3modal.subscribeModal / state:', state);
  if (!state.open) {
    // disconnect();
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
  console.log( core );

  let res = await fetchBalance({address: account.address!,token: contractAddress as any })
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
      args: [toAddress, 10000000n],
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

</script>

<template>
  <div>
    <!-- <div style="margin: 50px;">
      <h1>WalletConnectHtml</h1>
      <button @click="connect">connect</button>
      <button @click="transfer">transfer</button>
    </div> -->
    <fieldset>
        <legend><h1>WalletConnectHtml</h1></legend>
        <section>
          <a-button @click="web3modal.openModal({ chains })">连接</a-button>
          <a-button @click="disconnect()">断连</a-button>
          <a-button @click="switchNetwork({ chainId: 56 })">切换到主网</a-button>
        </section>
    </fieldset>
    <fieldset>
        <legend><h1>WalletConnectHtml</h1></legend>
        <section>
          <a-button @click="myGetAccount()">获取账户</a-button>
          <a-button @click="myGetBalance()">获取原生</a-button>
          <a-button @click="myGetBalance('0x561CDD3184985e5d38bb2d4c41b4c19C938d8cF7')">获取代币</a-button>
          <a-button @click="myTransfer()">转账原生</a-button>
          <a-button @click="myTransfer('0x561CDD3184985e5d38bb2d4c41b4c19C938d8cF7')">转账代币</a-button>
        </section>
    </fieldset>
  </div>
</template>




<!-- 

[
    "arbitrum",
    "arbitrumGoerli",
    "arbitrumNova",
    "arbitrumSepolia",
    "astar",
    "astarZkatana",
    "aurora",
    "auroraTestnet",
    "avalanche",
    "avalancheFuji",
    "base",
    "baseGoerli",
    "baseSepolia",
    "bearNetworkChainMainnet",
    "bearNetworkChainTestnet",
    "boba",
    "bronos",
    "bronosTestnet",
    "bsc",
    "bscTestnet",
    "bxn",
    "bxnTestnet",
    "canto",
    "celo",
    "celoAlfajores",
    "celoCannoli",
    "chiliz",
    "classic",
    "confluxESpace",
    "confluxESpaceTestnet",
    "coreDao",
    "cronos",
    "cronosTestnet",
    "crossbell",
    "dfk",
    "dogechain",
    "edgeware",
    "edgewareTestnet",
    "ekta",
    "ektaTestnet",
    "eos",
    "eosTestnet",
    "evmos",
    "evmosTestnet",
    "fantom",
    "fantomSonicTestnet",
    "fantomTestnet",
    "fibo",
    "filecoin",
    "filecoinCalibration",
    "filecoinHyperspace",
    "flare",
    "flareTestnet",
    "foundry",
    "fuse",
    "fuseSparknet",
    "gnosis",
    "gnosisChiado",
    "gobi",
    "goerli",
    "haqqMainnet",
    "haqqTestedge2",
    "hardhat",
    "harmonyOne",
    "holesky",
    "iotex",
    "iotexTestnet",
    "kava",
    "kavaTestnet",
    "klaytn",
    "klaytnBaobab",
    "kroma",
    "kromaSepolia",
    "linea",
    "lineaTestnet",
    "localhost",
    "lukso",
    "mainnet",
    "manta",
    "mantaTestnet",
    "mantle",
    "mantleTestnet",
    "meter",
    "meterTestnet",
    "metis",
    "metisGoerli",
    "mev",
    "mevTestnet",
    "modeTestnet",
    "moonbaseAlpha",
    "moonbeam",
    "moonbeamDev",
    "moonriver",
    "neonDevnet",
    "neonMainnet",
    "nexi",
    "nexilix",
    "oasys",
    "okc",
    "opBNB",
    "opBNBTestnet",
    "optimism",
    "optimismGoerli",
    "optimismSepolia",
    "pgn",
    "pgnTestnet",
    "plinga",
    "polygon",
    "polygonMumbai",
    "polygonZkEvm",
    "polygonZkEvmTestnet",
    "pulsechain",
    "pulsechainV4",
    "qMainnet",
    "qTestnet",
    "rollux",
    "rolluxTestnet",
    "ronin",
    "rootstock",
    "saigon",
    "sapphire",
    "sapphireTestnet",
    "scroll",
    "scrollSepolia",
    "scrollTestnet",
    "sepolia",
    "shardeumSphinx",
    "shibarium",
    "shimmer",
    "shimmerTestnet",
    "skaleBlockBrawlers",
    "skaleCalypso",
    "skaleCalypsoTestnet",
    "skaleChaosTestnet",
    "skaleCryptoBlades",
    "skaleCryptoColosseum",
    "skaleEuropa",
    "skaleEuropaTestnet",
    "skaleExorde",
    "skaleHumanProtocol",
    "skaleNebula",
    "skaleNebulaTestnet",
    "skaleRazor",
    "skaleTitan",
    "skaleTitanTestnet",
    "songbird",
    "songbirdTestnet",
    "spicy",
    "syscoin",
    "syscoinTestnet",
    "taikoJolnir",
    "taikoTestnetSepolia",
    "taraxa",
    "taraxaTestnet",
    "telos",
    "telosTestnet",
    "tenet",
    "thunderTestnet",
    "vechain",
    "wanchain",
    "wanchainTestnet",
    "xdc",
    "xdcTestnet",
    "zetachainAthensTestnet",
    "zhejiang",
    "zilliqa",
    "zilliqaTestnet",
    "zkSync",
    "zkSyncTestnet",
    "zora",
    "zoraSepolia",
    "zoraTestnet"
]


 -->