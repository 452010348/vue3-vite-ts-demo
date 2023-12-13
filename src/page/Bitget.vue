<template>
  <div style="margin-top: 50px;">
    <Button type="primary" @click="connect">connect</Button>
    <Button type="primary" @click="getChainId">getChainId</Button>
    <Button type="primary" @click="switchNetwork">switchNetwork</Button>
    <Button type="primary" @click="addToken">addToken</Button>
  </div>
</template>
<script setup lang="ts">
// https://web3.bitget.com/zh-CN/docs/guide/wallet/ethereum.html#%E5%9F%BA%E6%9C%AC%E7%94%A8%E6%B3%95
// import web3modal from 'bitkeep-web3modal';

// import Web3 from "web3";
// import { ethers } from 'ethers';
let Provider = getProvider();
console.log( Provider.isConnected() )

function getProvider(key="ethereum") {
  if( provider ){ Provider?.removeAllListeners();}
  const provider = (window as any)?.bitkeep && (window as any)?.bitkeep[key];
  if (!provider) {
    return window.open('https://web3.bitget.com/zh-CN/wallet-download?type=2');
  }
  Provider.on('accountsChanged', async (accounts) => {
    console.log("accounts changed", accounts)
  });
  Provider.on('chainChanged', async (chainId) => {
    console.log("chainId changed", chainId)
  });
  return provider;
}


async function connect() {
  const Provider = getProvider();
  try {
    const accounts = await Provider.request({ method: 'eth_requestAccounts' })

    console.log(accounts)
  } catch (error) {
    console.log( error )
  }
}
    
async function getChainId() {
  try {
    const chainId = await Provider.request({ method: 'eth_chainId' }); // 0x1
    console.log( chainId )
  } catch (error) {
    console.log( error )
  }
}

// 币注册表
async function addToken(){
  const Provider = getProvider();
  Provider
    .request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
          symbol: 'USDC',
          decimals: 6,
          image: 'https://file.ttpay.io/crypto/USDC.png',
        },
      },
    })
    .then((success) => {
      if (success) {
        console.log('FOO successfully added to wallet!');
      } else {
        throw new Error('Something went wrong.');
      }
    })
    .catch(console.error);
}
async function switchNetwork(){
  return new Promise(async(resolve,reject)=>{
    const Provider = getProvider();
    try {
      await Provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      });
      resolve('ok')
    } catch (switchError:any) {
      // This error code indicates that the chain has not been added to Bitkeep. 
      // 此错误代码表示该链尚未添加到Bitkeep
      if (switchError?.code === 4902) {
        try {
          await Provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x1',
                chainName: 'Custom Network',
                rpcUrls: ['https://custom-rpc.example.com'],
              },
            ],
          });
          resolve('ok')
        } catch (addError) {
          console.error( 'addError', addError )
          // handle "add" error
          reject(addError)
        }
      }
      console.error( 'switchError', switchError )
      // handle other "switch" errors
      reject(switchError)
    }
  })
}
async function fetchBalance(){

}

async function swapTokens(){
  const Provider = getProvider();
  const transactionParameters = {
    nonce: '0x00', // ignored by Bitkeep
    gasPrice: '0x09184e72a000', // customizable by user during Bitkeep confirmation.
    gas: '0x2710', // customizable by user during Bitkeep confirmation.
    to: '0x0000000000000000000000000000000000000000', // Required except during contract publications.
    from: Provider.selectedAddress, // must match user's active address.
    value: '0x00', // Only required to send ether to the recipient from the initiating external account.
    data:
      '0x7f7465737432000000000000000000000000000000000000000000000000000000600057', // Optional, but used for defining smart contract creation and interaction.
    chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by Bitkeep.
  };

  // txHash is a hex string
  // As with any RPC call, it may throw an error
  const txHash = await Provider.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters],
  });
}
</script>