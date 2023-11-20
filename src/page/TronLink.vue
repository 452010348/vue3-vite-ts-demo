<style scoped>
</style>
<template>
  <div>
    <h1>tronLink</h1>
    <a-button :loading="loading" @click="connect" v-if="!address">连接</a-button>
    <template v-else>
      <main class="flex" style="height: 100%;">
        <section>
          <div>钱包地址：{{ address }}</div>
          <h2>请切换至 Tron Nile 测试完</h2>

    
          <a-table :columns="columns" :data-source="contractAddressData.symbols" :pagination="false" ></a-table>
    
          
          <br>

          <div>
            TRX->USDT
            <a-button bordered  :loading="loading" @click="swapEth">1.智能合约兑换【swapEth】</a-button>
          </div>
          
          <br>
          
          <div>
            USDT->TRX
            <a-button :loading="loading" @click="swapTokens">1.触发智能合约【swapTokens】</a-button>
            <a-button :loading="loading" @click="sign">2.签名</a-button>
            <a-button :loading="loading" @click="sendRawTransaction">3.发送交易</a-button>
          </div>
          
          <h2>转账</h2>
          <div class="flex">
            <a-button :loading="loading" @click="transfer.transfer" type="primary">转账</a-button>
            <a-input prefix="￥" style="width: 100px;" v-model:value="contractAddressData.amount" />
            <a-select v-model:value="contractAddressData.selectedSymbol"  style="width: 120px;">
              <a-select-option v-for="symbol in contractAddressData.symbols" :value="symbol.symbol">{{ symbol.symbol }}</a-select-option>
            </a-select>
            <a-input v-model:value="contractAddressData.toAddress" placeholder="接收人地址,不能是自己" />
          </div>

          <h2>授权</h2>
          <div class="flex">
            <a-button :loading="loading" @click="b.approve" type="primary">授权</a-button>
            <a-input prefix="￥" style="width: 100px;" v-model:value="contractAddressData.amount" />
            <a-select v-model:value="contractAddressData.selectedSymbol"  style="width: 120px;">
              <a-select-option v-for="symbol in contractAddressData.symbols" :value="symbol.symbol">{{ symbol.symbol }}</a-select-option>
            </a-select>
            <a-input v-model:value="contractAddressData.toAddress" placeholder="接收人地址,不能是自己" />
            <a-button :loading="loading" @click="b.allowance" type="primary">检索授权额度</a-button>
          </div>

          <br>
          <!-- <div>
            TRX->USDT
            <a-button :loading="loading" @click="transfer.sendTrx('TPfeaP6W6sTdNmvb2kjc56jhtNwNMsssss',200,'TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq')">1.构建转账交易</a-button>
            <a-button :loading="loading" @click="transfer.sign">2.签名</a-button>
            <a-button :loading="loading" @click="transfer.sendRawTransaction">3.后端广播</a-button>
          </div> -->
        </section>
        <pre class="flex-1" style="border: 1px solid red;overflow: auto; position: fixed;top: 50px;left:40%;right: 10px;bottom: 10px;">{{ raw_data }}</pre>
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
// import axios from 'axios';
import { ref, reactive, toRaw, computed, watch } from 'vue';
import { TronLinkAdapter } from '@tronweb3/tronwallet-adapters';
import { abi } from '../TronLink/abi';
import { base58checkToHex } from '../utils/helpers';
import { contractAddress_Nile } from '../utils/contractAddress';
import { message } from 'ant-design-vue';
import axios from 'axios';
let tronWeb = (window as any).tronWeb ?? null;
// 主网USDT 合约地址
// const contractAddressTronGridUSDT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

const adapter = new TronLinkAdapter({ openTronLinkAppOnMobile: false, openUrlWhenWalletNotFound: false });


const columns = [
  {title: 'symbol',dataIndex: 'symbol',},
  {title: 'address',dataIndex: 'address',},
  {title: 'balance',dataIndex: 'balance',},
  {title: 'precision',dataIndex: 'precision',},
];

// 钱包地址
const address = ref(tronWeb?.defaultAddress?.base58 ?? '');
// USDT代币合约地址
const contractAddress = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';
const contractAddressData = reactive({
  symbols: contractAddress_Nile(),
  selectedSymbol:'TRX',
  amount:10,
  toAddress:"TXR4hiTCniVHKhWbe6ps9wNaGRxw28isPo"
})
// 签名数据
const raw_data = reactive({
  transaction: '',
  signedTx: '',
  broastTx: '',
});
const loading = ref(false);
async function connect() {
  loading.value = true;
  try {
    if (!tronWeb) {
      throw new Error('请先安装TronLink钱包插件');
    }
    await adapter.connect();
    console.log('address :>> ', adapter.address);
    address.value = adapter.address;
  } catch (error) {
    console.log('error :>> ', error);
  }
  loading.value = false;
}

async function swapEth() {
  loading.value = true;
  // 获取合约实例
  const contractInstance = await tronWeb.contract(abi, contractAddress);
  console.log('>>>', contractInstance);
  // 兑换TRX为USDT
  const tokenFrom = 'TRX';
  const tokenTo = 'USDT';
  const amount = 100; // 兑换数量，这里是100个TRX
  try {
    const tx = await contractInstance.swapEth(tokenFrom, tokenTo, amount).send();
    console.log('>>>兑换成功', tx);
  } catch (error) {
    console.log('>>>兑换失败:', error);
  }
  loading.value = false;
}
//1. 触发智能合约 (创建构建都一个意思)
async function swapTokens() {
  loading.value = true;
  const params = {
    /** TRON 路由器智能合约的地址 */
    tronRouterAddrees: base58checkToHex('TSv6HwXSx6zTSBa8YyyN9k22PrjuaPXocj').toUpperCase(),
    /** 要调用的智能合约的函数名 */
    functionName: 'swapEth(string,string,uint256)',
    /** 包含一些可选交易选项的对象，例如手续费限制和交易价值等。 */
    options: {
      feeLimit: 1000000000,
      callValue: `0x${Number(30 * 10 ** 6).toString(16)}`,
    },
    /** 作为输入传递给函数的参数对象的数组。数组中的每个对象都需要指定一个类型和一个值。 */
    parameter: [
      {
        type: 'string',
        value: 'USDT',
      },
      {
        type: 'string',
        value: '0x3CC7C99a9cB36d21c9a92e7d7119E680a021ABCD',
      },
      {
        type: 'uint256',
        value: '0x1108f4bf15cac0000',
      },
    ],
    // 执行交易的发起人地址。
    fromAddress: base58checkToHex('TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq').toUpperCase(),
  };
  const arr = [params.tronRouterAddrees, params.functionName, params.options, params.parameter, params.fromAddress];
  let transaction = await tronWeb.transactionBuilder.triggerSmartContract(...arr);
  raw_data.transaction = transaction.transaction;
  console.log('transaction :>>>', transaction);
  loading.value = false;
}
// // 1. 触发智能合约 (创建构建都一个意思)
// async function swapTokens() {
//   loading.value = true;
//   raw_data.transaction = '';
//   raw_data.signedTx = '';
//   raw_data.broastTx = '';
//   // 设置交易参数
//   // const tokenAddress = contractAddress; // 输入代币合约地址
//   /** TRON 路由器智能合约的地址  */
//   const tokenAddress = base58checkToHex('TSv6HwXSx6zTSBa8YyyN9k22PrjuaPXocj').toUpperCase();
//   const amount = 10 * 10 ** 6; // 10 个输入代币
//   const outputTokenAddress = 'TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq'; // 输出代币合约地址
//   const minAmountOut = 1; // 输出代币的最小数量
//   const toAddress = 'TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq'; // 接收交易输出代币的地址
//   try {
//     let transaction = await tronWeb.transactionBuilder.triggerSmartContract(
//       tokenAddress,
//       'swap(uint256,address,uint256,address)',
//       8 * 10 ** 6, // 设置 TRX 燃料费
//       `0x${Number(9 * 10 ** 6).toString(16)}`, //金额
//       [
//         {
//           type: 'uint256',
//           value: amount,
//         },
//         {
//           type: 'address',
//           value: outputTokenAddress,
//         },
//         {
//           type: 'uint256',
//           value: minAmountOut,
//         },
//         {
//           type: 'address',
//           value: toAddress,
//         },
//       ],
//       toAddress
//     );
//     raw_data.transaction = transaction.transaction;
//     console.log('transaction :>>>', transaction);
//   } catch (error) {
//     console.log('transaction :>>>', error);
//   }
//   loading.value = false;
// }
// 2.签名
async function sign() {
  loading.value = true;
  try {
    let signedTx = await tronWeb.trx.sign(toRaw(raw_data.transaction));
    raw_data.signedTx = signedTx;
    console.log('signedTx :>>>', signedTx);
  } catch (error) {
    console.log('>>>', error);
  }
  loading.value = false;
}
// 3.发送交易
async function sendRawTransaction() {
  loading.value = true;
  try {
    let broastTx = await tronWeb.trx.sendRawTransaction(raw_data.signedTx);
    raw_data.broastTx = broastTx;
    console.log('broastTx :>>> ', broastTx);
  } catch (error) {
    console.log('broastTx :>>>', error);
  }
  loading.value = false;
}


class transfer {

  static async sendTrx(toAddress:string,amount:any,fromAddress:string){
    loading.value = true;
      raw_data.transaction=  ''
      raw_data.signedTx=  ''
      raw_data.broastTx=  ''

    amount = amount < 200 ? 200 : amount
    amount = Number(amount).toFixed(6)
    console.log( arguments );
    try {
      const tx = await tronWeb.transactionBuilder.sendTrx(toAddress,tronWeb.toSun(amount),fromAddress)
      raw_data.transaction = tx;
      console.log("tx :>>>",tx)
    }catch(error){
      console.log("tx :>>>",error)
    }
    loading.value = false;
  }
  static async sign() {
    loading.value = true;
    try {
      let signedTx = await tronWeb.trx.sign(toRaw(raw_data.transaction));
      raw_data.signedTx = signedTx;
      console.log('signedTx :>>>', signedTx);
    } catch (error) {
      console.log('signedTx :>>>', error);
    }
    loading.value = false;
  }
  static async sendRawTransaction() {
    loading.value = true;
    try {
      const { data } = await axios.post('/v1/exchange/create_order',{
        requestBody:{
          "pay_symbol": "TRX",
          "exchange_symbol": "USDT",
          "receive_address": "TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq",
          "signed_txn": raw_data.signedTx
        }
      },{headers: { 'Content-Type': 'application/json'}})
      if(data.code!=0){
        //请选择货币
        alert(data.msg)
      }else{
        raw_data.broastTx = data.data
      }
        // 请选择货币
      console.log('broastTx :>>> ', data);
    } catch (error) {
      console.log('broastTx :>>>', error);
    }
    loading.value = false;
  }
  // 查看订单
  static async query(){
    loading.value = true;
    try {
      const { data } = await axios.get('/v1/exchange/query?tx_id=53e4b88756188a04347d9825d59231c159fe4ecdf5992ea7b57811df2a9401ca&order_no=2311205504513935361426&trx_address=TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq')
      console.log('query :>>> ', data);
    } catch (error) {
      console.log('query :>>>', error);
    }
    loading.value = false;
  }
  // 转账 ok
  static async transfer() {
    loading.value = true;
    /** 转账金额 */
    const amount = contractAddressData.amount * 10 ** 6;
    /** 转账的币种合约地址 */
    const contractAddress = getContractAddress()
    /** 接收人钱包地址 */
    const toAddress = contractAddressData.toAddress
    let transferTx = ""
    try {
      // 原生币种转账
      if( /^0xe+$/.test(contractAddress) ){
         transferTx = await tronWeb.trx.sendTransaction(toAddress, amount);
      }else{
        // 创建合约实例
        const contract = await tronWeb.contract().at(contractAddress);
        // 创建资金划转交易
         transferTx = await contract.transfer(toAddress, amount).send();
      }
      raw_data.signedTx = transferTx
      console.log('USDT transfer successful');
      console.log('Transaction ID:', transferTx);
      message.success("转账成功")
    } catch (error) {
      message.error("转账失败")
      console.error('USDT transfer failed:', error);
    }
    loading.value = false;
  }
}
// 获取合约地址
function getContractAddress():string{
  return contractAddressData.symbols.find((t:any)=>{return t.symbol===contractAddressData.selectedSymbol})?.address ?? ""
}
// 获取余额
async function getAccount(contractAddress:string, ownerAddress=tronWeb?.defaultAddress?.base58){
  // 原生币种转账
  if( /^0xe+$/.test(contractAddress) ){
    loading.value = true;
    const account = await tronWeb.trx.getAccount();// 返回 (余额)*10**6
    loading.value = false;
    return account.balance/10**6
  }else{
    loading.value = true;
    const contract = await tronWeb.contract().at(contractAddress);
    const balance = await contract.balanceOf(ownerAddress).call();
    loading.value = false;
    console.log('余额：', balance.toString());
    return Number(balance.toString())/10**6
  }
  
}
// 获取精度
async function decimals(contractAddress:string){
    // 获取 TRX 精度
  if( /^0xe+$/.test(contractAddress) ){
    const trxDigits = 6
    console.log('TRX 精度：', trxDigits);
    return  Promise.resolve(trxDigits)
  }
  try {
    loading.value = false;
    var num = 0;
    const contract = await tronWeb.contract().at(contractAddress);
    const _decimals = await contract.decimals().call();
    if( typeof _decimals === 'Object'){
      num = _decimals.toNumber()
    }else if( typeof _decimals === 'number'){
      num = _decimals
    }else{
      num = _decimals.toNumber()
    }
    loading.value = false;
    console.log('代币精度：', num);
    return Promise.resolve(num)
  } catch (error) {
    return 0
  }

}

// ok 检索余额
watch(()=>raw_data.signedTx, async ()=>{
  contractAddressData.symbols.forEach( async (t:any)=>{
    getAccount(t.address).then((r)=>{t.balance=r})
    t.precision = await decimals(t.address)
    console.log(t.symbol, t.address, t.precision  )
    // getAccount(t.address).then((r)=>{t.balance=r})
    // decimals(t.address).then((r)=>{t.precision=r})
  })
},{immediate:true})


class b {
  // 授权额度
  static async approve(){
    /** 转账金额 */
    const amount = contractAddressData.amount * 10 ** 6;
    /** 转账的币种合约地址 */
    const contractAddress = getContractAddress()
    /** 接收人钱包地址 */
    const toAddress = contractAddressData.toAddress
    if( /^0xe+$/.test(contractAddress) ){
      message.warning('TRX 不需要授权')
      return
    }
    loading.value = true;
    try {      
      const contract = await tronWeb.contract().at(contractAddress);
      await contract.approve(toAddress, amount).send()
      message.success(`成功授权${amount/10**6}额度`)
    } catch (error) {
      console.error("approve :>>>", error)
    }
    loading.value = false;
  }
  // 检索授权额度
  static async allowance(){
    const fromAddress=tronWeb?.defaultAddress?.base58
    /** 转账的币种合约地址 */
    const contractAddress = getContractAddress()
    /** 接收人钱包地址 */
    const toAddress = contractAddressData.toAddress
    if( /^0xe+$/.test(contractAddress) ){
      message.warning('TRX 无需检索')
      return
    }
    loading.value = true;
    try {      
      const contract = await tronWeb.contract().at(contractAddress);
      const _allowance = await contract.allowance(fromAddress, toAddress).call();
      console.log('当前授权额度:', _allowance.toString());
      message.success(`当前授权额度: ${Number(_allowance.toString())/10**6}`)
    } catch (error) {
      console.error("allowance :>>>", error)
    }
    loading.value = false;
  }
}

</script>




<!-- try {
  const tx = await tronWeb.transactionBuilder.sendTrx(
    toAddress,
    tronWeb.toSun(amount),
    fromAddress,
  )
  const signedTx = await tronWeb?.trx.sign(tx)

  if (broadcast) {
    const broastTx = await tronWeb?.trx.sendRawTransaction(signedTx)
    return broastTx
  }

  return signedTx
} -->