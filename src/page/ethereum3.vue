<template>
  <div>
    <h2>ethereum3</h2>
    {{ ethers.toBeHex('1') }}
    {{ ethers.parseUnits('0.01', 18) }}
    {{ ethers.formatUnits('1000', 3) }}
    <a-button @click="aa.swapEth">swapEth</a-button>
    <a-button @click="aa.allowance">allowance</a-button>
    <a-button @click="aa.swapEthToUsdt">swapEthToUsdt</a-button>
    <a-button @click="swapEthForUsdt">222</a-button>
  </div>
</template>

<script setup lang="ts">
// 导入 ethers.js 库
// import { axios } from 'axios';
import { ethers } from 'ethers';
import { abi } from '../TronLink/abi';

const erc20aABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function approve(address spender, uint256 amount) returns (bool)',
  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
];
let ethereum = (window as any).ethereum;
let provider: BrowserProvider;
provider = new ethers.BrowserProvider(ethereum) as BrowserProvider;
// ERC20 USDT 合约 ABI
const usdtABI = [
  // 这里省略其他方法...
  {
    constant: false,
    inputs: [
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'swapEthToUsdt',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
];
class aa {
  static async allowance() {

  }
  // 0x2B0974b96511a728CA6342597471366D3444Aa2a USDC 6 代币合约
  static async approve(): Promise<any> {
    // 调用授权方法
    const tokenAddress = '0xA1d7f71cbBb361A77820279958BAC38fC3667c1a'; //USDT 6 代币合约地址
    const spenderAddress = ''; // 跨链桥合约地址
    const amount = ethers.parseUnits('0.01', 18); // 授权的代币数量 "1 000 000" 不需要使用 toHex

    let signer = await provider.getSigner();
    const contract = new ethers.Contract(tokenAddress, abi.ERC20, signer); // tokenAddress 代币合约地址

    const approveTransaction = await contract.approve(spenderAddress, amount);
    const tx = await approveTransaction.wait();
    console.log('Transaction hash:', tx.transactionHash);
  }
  static async swapEth() {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract('0xA1d7f71cbBb361A77820279958BAC38fC3667c1a', erc20aABI, signer); // tokenAddress 代币合约地址

    const value = ethers.parseEther('0.1'); // 将以太币值转换为对应的 wei 值
    const recipientAddress = await signer.getAddress();

    const data = contract.interface.encodeFunctionData('swapEth', ['0xA1d7f71cbBb361A77820279958BAC38fC3667c1a', recipientAddress, value]);

    // 构建交易对象
    const transactionObject = {
      to: contract.address,
      value: value,
      data: data,
    };

    // 发送交易到以太坊网络
    const txResponse = await signer.sendTransaction(transactionObject);
    console.log('Transaction Response:', txResponse);


    // let signer = await provider.getSigner();
    // const contract = new ethers.Contract('0xA1d7f71cbBb361A77820279958BAC38fC3667c1a', erc20aABI, signer); // tokenAddress 代币合约地址
    // debugger
    // let value = ethers.toBeHex('0.1')
    // let data = contract.interface.encodeFunctionData('swapEth', ['0xA1d7f71cbBb361A77820279958BAC38fC3667c1a', signer.getAddress(), value])
    // // 1. 构建交易参数对象
    // const transactionObject = {
    //   value,
    //   data
    // };

    // // 2.发送交易到以太坊网络 （签名 与广播 是合并的）
    // const signTx = await signer.sendTransaction(transactionObject);
    // console.log('signTx >>', JSON.stringify(signTx, null, 2))
  }


  static async swapEthToUsdt() {

    const signer = provider.getSigner();

    const usdtContract = new ethers.Contract('0xA1d7f71cbBb361A77820279958BAC38fC3667c1a', usdtABI, signer);

    const value = ethers.parseEther('0.1').toString(); // 将以太币值转换为 wei 值
    debugger
    try {
      const transaction = await usdtContract.swapEthToUsdt(value, { value: value });
      await transaction.wait();
      console.log('USDT swapped successfully!');
    } catch (error) {
      console.error('Failed to swap ETH to USDT:', error);
    }
  }
}



import { Web3 } from 'Web3'
const web3 = new Web3(ethereum);
const contractAddress = '0xA1d7f71cbBb361A77820279958BAC38fC3667c1a';
const contract = new web3.eth.Contract(usdtABI, contractAddress);
const swapEthForUsdt = async () => {
  const value = ethers.parseEther('0.1').toString()
  debugger
  const data = contract.methods.swapEthToUsdt().encodeABI();
  const accounts = await web3.eth.getAccounts();
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 200000;
  const tx = {
    from: accounts[0],
    to: contractAddress,
    value,
    data,
    gasPrice,
    gasLimit
  };
  debugger
  const signer = await provider.getSigner();
  // 2.发送交易到以太坊网络 （签名 与广播 是合并的）
  const signTx = await signer.sendTransaction(tx);
  console.log(">>", signTx)
  // const txHash = await web3.eth.sendTransaction(tx);
  // console.log(`Transaction hash: ${txHash}`);

  // const balance = await contract.methods.balanceOf(accounts[0]).call();
  // console.log(`Your USDT balance: ${balance}`);
};
</script>
