<template>
    <div>
        tronLink
        <button @click="onClick()">trx转usdt</button>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';

async function onClick(){
    // "symbol": "TRX",
    transfer({
        "fromAddress": "TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq",
        "toAddress": "TPfeaP6W6sTdNmvb2kjc56jhtNwNMsssss",
        // "chainId": "0xcd8690dc",
        "amount": "200.000000",
        broadcast:false,
    })
}

async function transfer(params: {
    fromAddress: string
    toAddress: string
    // chainId: string
    amount: string
    broadcast?: boolean
  }) {
    const tronWeb = (window as any).tronWeb
    const { fromAddress, toAddress, amount, broadcast } = params
    try {
      const tx = await tronWeb.transactionBuilder.sendTrx(
        toAddress,
        tronWeb.toSun(amount),
        fromAddress,
      )
      const signedTx = await tronWeb?.trx.sign(tx)
      if (broadcast) {
        return tronWeb?.trx.sendRawTransaction(signedTx)
      }
      return create_order(params,signedTx)
    }
    catch (err) {
      console.log( err ); 
      return Promise.reject(err)
    }
  }
  
function create_order(params,signedTx){
    let data = {
        "exchange_symbol": "USDT",
        "pay_symbol": "TRX",
        "receive_address": "TAgv2M2Yirj9WDaYUdXWGJkxZqoLvvPRsq",
        "signed_txn": signedTx,
    }
    // 兑换下单后端广播
    var config = {
        method: 'post',
        url: '/v1/exchange/create_order',
        headers: { 'Content-Type': 'application/json'},
        data : data
    };
    return axios(config)
}

</script>