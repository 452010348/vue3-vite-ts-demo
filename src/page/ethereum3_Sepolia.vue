<template>
  <div>
    <h2>ethereum3_Sepolia</h2>
    <a-button @click="connect()" >连接钱包</a-button>
    <template v-if="selectedAddress">
      <p>钱包列表：{{ walletList }}</p>
      <p>当前钱包：{{ selectedAddress }}</p>
      <p>当前链id：{{ chainId }}</p>
      <p>当前网络：{{ netName }}</p>
      <p>原生币余额: {{ balance }}</p>
      <pre>{{ USDT }}</pre>

      <hr>

      <a-button @click="getBalance(USDT)">获取USDT代币余额</a-button>
      <a-button @click="sendEthTransaction('0xdEfB419bf2DE2852126b155671e5cd201B30Fe96', '2')">发送交易</a-button>
      <a-button @click="sigMsg()">对消息进行签名</a-button>

      <br><hr>

      <a-button v-for="item in networkList" @click="switchNetwork(Number(item?.ChainID))">{{ item?.网络归属 }} {{ item?.网络类型 }}</a-button>
      <!-- <a-button @click="switchNetwork(1)">切换ETH主网</a-button>
      <a-button @click="switchNetwork(56)">切换BSC主网</a-button>
      <a-button @click="switchNetwork(8453)">切换BASE主网</a-button>
      <a-button @click="switchNetwork(11155111)">切换S测试网</a-button>
      <a-button @click="switchNetwork(59140)">切换L测试网</a-button> -->
    </template>
  </div>
</template>

<script setup lang="ts">
// rpc    https://sepolia.infura.io/v3/
// 链 ID   11155111
// 区块浏览器 URL  https://sepolia.etherscan.io
// 货币符号 SepoliaETH

// LineaETH测试网领币地址： https://www.infura.io/faucet/linea
// sepolia测试网领币地址： https://www.infura.io/faucet/sepolia
//每个测试网转转移币种demo https://faucets.chain.link/kovan

// import { axios } from 'axios';
import { ethers, parseEther } from 'ethers';
// import { Web3 } from 'web3'
import { reactive, ref } from 'vue';
import { message,Modal } from 'ant-design-vue';
// import { abi } from '../TronLink/abi.js';
const ethereum = (window as any).ethereum;

/** 代币 */
const USDT = reactive({
  name: 'USDT',
  address: '0xa1d7f71cbbb361a77820279958bac38fc3667c1a',
  balance: '0',
  decimal: 6,
  chainId: 11155111,
});
/** 已链钱包列表 */
const walletList = ref([]);
/** 当前钱包地址 */
const selectedAddress = ref('');
/** 原生币余额 */
const balance = ref<any>('');
/** 当前链ID */
const chainId = ref<any>('');
/** 当前网络 */
const netName = ref<any>('');

ethereum.on('accountsChanged', (e: any) => {
  console.log('accountsChanged', e);
});
ethereum.on('chainChanged', (e: string) => {
  console.log('chainChanged', e);
  chainId.value = String(parseInt(e,16))
});
ethereum.on('connect', (e: any) => {
  console.log('connect', e);

});
ethereum.on('disconnect', (e: any) => {
  console.log('disconnect', e);
});
// let web3 = new Web3(ethereum);
let provider = new ethers.BrowserProvider(ethereum);
console.log('>>', provider);
if (ethereum.selectedAddress) {
  connect();
}
/** 用户授权 */
async function connect() {
  try {
    // await ethereum.request({ method: 'eth_requestAccounts' })
    // 请求用户授权
    walletList.value = await ethereum.enable();
    selectedAddress.value = ethereum.selectedAddress;
    console.log('>> userList', walletList.value);
    console.log('>> selectedAddress', selectedAddress.value);

    // 获取该地址的余额
    provider.getBalance(ethereum.selectedAddress).then((res) => {
      balance.value = Number(ethers.formatEther(res))
      console.log('>> balance', balance.value);
    });
    // 获取该地址的一些其他信息
    provider.getNetwork().then((res) => {
      netName.value = res.name;
      chainId.value = Number(res.chainId);
      console.log('>> network', JSON.stringify(res,null,2) );
    })
    return Promise.resolve()
  } catch (error) {
    console.log('>> 找不到适合的以太坊 Provider', error);
    return Promise.reject(error)
  }
}
// await addNetwork({
//   chainId: token.chainId.toString(16),
//   rpcUrl: 'https://sepolia.infura.io/v3/',
//   chainName: 'Sepolia',
//   symbol: 'SepoliaETH',
//   decimals: 18,
//   iconUrl: 'https://sepolia.etherscan.io',
// })
interface params1 {
  /** 要添加的网络的链ID */
  chainId: string;
  /** 要添加的网络的RPC URL */ 
  rpcUrl: string;
  /** 要添加的网络的名称 */
  chainName: string;
  /** 主代币的代号 */
  symbol: string;
  /** 主代币的小数位数 */
  decimals: number;
  /** 可选：要添加的网络的图标URL */
  iconUrl: string;
}
/** 添加网络 */
function addNetwork(params:params1){
  let data = Object.assign({
    chainId : '0x1', 
    rpcUrl : 'https://custom-rpc.example.com', 
    chainName : 'Custom Network', 
    symbol : 'ETH', 
    decimals : 18, 
    iconUrl : 'https://custom-rpc.example.com/icon.png', 
  }, params)
  return ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: data.chainId, // 要添加的网络的链ID
        chainName:data.chainName, // 要添加的网络的名称
        nativeCurrency: {
          name: data.symbol,  // 主代币的名称
          symbol: data.symbol, // 主代币的代号
          decimals: data.decimals // 主代币的小数位数
        },
        rpcUrls: [data.rpcUrl],
        blockExplorerUrls: [data.rpcUrl], // 可选：要添加的网络的区块浏览器URL
        iconUrls: [data.iconUrl] // 可选：要添加的网络的图标URL
      }
    ]
  })
}
/** 切换网络 */
async function switchNetwork(chainId:number) :Promise<any> {
  try {
    console.log( `0x${Number(chainId).toString(16)}` )
    return await provider.send('wallet_switchEthereumChain', [{ chainId:`0x${Number(chainId).toString(16)}` }])
  } catch (error:Error|any) {
    console.error(error);
    const obj = networkList.find((item) => item.ChainID === chainId)  
    if( obj ){
      return addNetwork( {
        /** 要添加的网络的链ID */
        chainId: `0x${obj.ChainID.toString(16)}`,
        /** 要添加的网络的RPC URL */ 
        rpcUrl: obj.浏览器链接,
        /** 要添加的网络的名称 */
        chainName: obj.网络名称,
        /** 主代币的代号 */
        symbol: obj.货币符号,
        /** 主代币的小数位数 */
        decimals: 18,
        /** 可选：要添加的网络的图标URL */
        iconUrl: 'https://custom-rpc.example.com/icon.png',
      })
    }
    return Promise.reject(error)
  }
}

interface tokenType {
  name: string;
  address: string;
  balance: string;
  decimal: number;
  chainId: number;
}
/** 获取代币余额 */
async function getBalance(token: tokenType) {
  const abi = [
    'function decimals() view returns (string)',
    'function symbol() view returns (string)',
    'function balanceOf(address addr) view returns (uint)',
  ];
  await switchNetwork(token.chainId)
  try {
    await connect()
    const contract = new ethers.Contract(token.address, abi, provider);
    token.balance = await contract
      .balanceOf(selectedAddress.value)
      .then((res) => String(Number(ethers.formatUnits(res, token.decimal))));

    console.log('>> token.balance', token.balance);
  } catch (error: Error | any) {
    console.error('>> getBalance', error);
    message.error(error.message || '获取余额失败');
  }
}

/** 发送交易 ETH原生币 */
async function sendEthTransaction(toAddress: string, amount = '0') {
  await switchNetwork(11155111)

  let signer = await provider.getSigner();
  //发送事务时，该值为wei，所以parseEther
  //将ether转换为wei。
  let tx = await signer.sendTransaction({
    to: toAddress,
    value: parseEther(amount),
  });
  console.log('tx :>> ', tx);
  // 通常，您可能希望等到事务被挖掘
  let receipt = await tx.wait();
  console.log('receipt :>> ', receipt);
}

/** 对消息进行签名 */
async function sigMsg() {
  try {
    let id = ethers.id('test');
    // 0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658
    // 我们的签名者;签名消息不需要提供者
    let signer = new ethers.Wallet(id);
    // Wallet {
    //   address: '0xC08B5542D177ac6686946920409741463a15dDdB',
    //   provider: null
    // }
    let message = 'sign into ethers.org?';
    // 签名消息
    let sig = await signer.signMessage(message);
    // '0xefc6e1d2f21bb22b1013d05ecf1f06fd73cdcb34388111e4deec58605f3667061783be1297d8e3bee955d5b583bac7b26789b4a4c12042d59799ca75d98d23a51c'
    // 验证消息;注意地址与签名者匹配
    let a = ethers.verifyMessage(message, sig);
    // 0xC08B5542D177ac6686946920409741463a15dDdB
    console.log('>>id', id);
    console.log('>>signer', signer);
    console.log('>>sig', sig);
    console.log('>>a', a);

    Modal.info({
        title: 'sig',
        content: sig,
        onOk() {
          console.log('ok');
        },
      });
    
  } catch (error) {
    console.error('>> error', error);
  }
}

// let TokenABI = [
// 'function exchangeToken(address _to, uint256 _value) external returns (bool);'
// ]
// // let tx = new ethers.Transaction();
// // console.log('>>tx', JSON.stringify(tx, null, 2));
// // debugger;

// // 构造交易参数
// const txParams = {
//   gasLimit: 600000,
//   value: ethers.parseEther('0.1'),
// };
// // 创建一个合约实例
// const Token = new ethers.Contract(tokenAddress, TokenABI, wallet);
// // 调用合约（exchangeToken 函数）进行交易
// const tx = await Token.exchangeToken(toAddress, exchangeValue, txParams);

// // 使用钱包签名交易
// const signedTx = await new ethers.wallet.sign(tx);

// // 发送交易到以太坊网络
// const txHash = await provider.sendTransaction(signedTx);


const networkList = reactive([
  {
    "网络归属" : "ETH",
    "网络类型" : "主网",
    "网络名称" : "主网",
    "RPC" : "https://eth.trongrid.io",
    "ChainID" : 1,
    "货币符号":"ETH",
    "浏览器链接" : "https://etherscan.io",
  },
  {
    "网络归属" : "Linea",
    "网络类型" : "主网",
    "网络名称" : "Linea 主网",
    "RPC" : "https://linea-mainnet.infura.io/v3/",
    "ChainID" : 59144,
    "货币符号" : "ETH",
    "浏览器链接" : "https://lineascan.build",
  },
  {
    "网络归属" : "BSC",
    "网络类型" : "主网",
    "网络名称" : "主网",
    "RPC" : "https://bsc.trongrid.io",
    "ChainID" : 56,
    "货币符号": "BNB",
    "浏览器链接" : "https://bscscan.com",
  },
  {
    "网络归属" : "ETH",
    "网络类型" : "测试网",
    "网络名称" : "Goerli 测试网",
    "RPC" : "https://eth-goerli.trongrid.io",
    "ChainID" : 5,
    "货币符号" : "Goerli ETH",
    "浏览器链接" : "https://goerli.etherscan.io",
  },
  {
    "网络归属" : "BSC",
    "网络类型" : "测试网",
    "网络名称" : "BSC测试网",
    "RPC" : "https://testnet-bsc.trongrid.io",
    "ChainID" : 97,
    "货币符号" : "BNB",
    "浏览器链接" : "https://testnet.bscscan.com",
  },
  {
    "网络归属" : "Sepolia",
    "网络类型" : "测试网",
    "网络名称" : "Sepolia测试网络",
    "RPC" : "https://sepolia.infura.io/v3/",
    "ChainID" : 11155111,
    "货币符号" : "SepoliaETH",
    "浏览器链接" : "https://sepolia.etherscan.io",
  },
  {
    "网络归属" : "Goerli",
    "网络类型" : "测试网",
    "网络名称" : "Goerli 测试网络",
    "RPC" : "https://goerli.infura.io/v3/",
    "ChainID" : 5,
    "货币符号" : "GoerliETH",
    "浏览器链接" : "https://goerli.etherscan.io",
  },
  {
    "网络归属" : "Linea Goerli",
    "网络类型" : "测试网",
    "网络名称" : "Linea Goerli 测试网络",
    "RPC" : "https://linea-goerli.infura.io/v3/",
    "ChainID" : 59140,
    "货币符号" : "LineaETH",
    "浏览器链接" : "https://goerli.lineascan.build",
  }
])

/**
 
在以太坊上，您可以通过交易所或去中心化交易平台（DEX）进行 ETH 到 USDT 的兑换。以下是一种常见的方法，以使用 Uniswap DEX 进行 ETH 到 USDT 的兑换：
  1、打开 Uniswap 网站（https://app.uniswap.org/）或使用相应的移动应用程序。
  2、确保您拥有足够的 ETH 在您的以太坊钱包上，以进行兑换操作。
  3、在交易界面上，选择 ETH 作为输入资产。
  4、在目标资产中，搜索并选择 USDT（或 Tether）。
  5、输入您要交换的 ETH 数量。
  6、确认交易细节，并在钱包应用程序中授权和批准交易。
  7、等待交易在以太坊网络上确认，并完成兑换。
  请注意，使用 Uniswap 或其他 DEX 进行兑换时，交易价格是根据流动性池中的供需比例来确定的，并且交易可能会有一定的手续费。确保在进行任何交易前，仔细检查交易细节，并确认费用和汇率等信息。
此外，还有其他交易所和 DEX 可供选择。您可以选择符合您需求和安全性要求的平台，并遵循相应的兑换流程。
 */
</script>
