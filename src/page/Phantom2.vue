<script lang="ts" setup>
import * as anchor from '@project-serum/anchor'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import * as web3 from '@solana/web3.js';
import * as splToken from '@solana/spl-token';
/** 检测提供者 */
const getProvider = (solana: string) => {
  if ('phantom' in window) {
    const provider = window?.phantom[solana];
    if (provider?.isPhantom) {
      return provider;
    }
  }
  // window.open('https://phantom.app/', '_blank');
  alert('需要安装插件 https://phantom.app/')
};

async function main() {
  let provider = getProvider("solana");
  await provider.connect()
  // 获取Solana连接
  const rpcUrl = web3.clusterApiUrl(WalletAdapterNetwork.Testnet)
  const connection = new web3.Connection(rpcUrl);

  // 获取程序地址
  const fromPubkey = provider.publicKey
  const toPubkey = new web3.PublicKey('FwxC5VwvYoU55mZBynwPu6xs3sdKnWp52UgXvwumWjGK')
  const tokenPubkey = new web3.PublicKey('Dmu6Lk5AZccmRtnmGmqWA1ZBFAmZFRhRdT6fMonbBLNS');
}
main();
</script>