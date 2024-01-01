安装solana工具套件： https://docs.solana.com/cli/install-solana-cli-tools#windows-1

github 版本下载： https://github.com/solana-labs/solana/releases


# 1. 下载  solana-install-init.exe 到电脑上 然后执行安装 solana-install-init.exe v1.17.13
- 默认安装路径为： C:\Users\Administrator\.local\share\solana\install\releases\1.17.13
```sh
curl https://lujinfeng.top:88/alist/d/public/solana-install-init-x86_64-pc-windows-msvc.exe ^
  --output C:\solana-install-tmp\solana-install-init.exe ^
  --create-dirs
C:\solana-install-tmp\solana-install-init.exe v1.17.13
```

# 查看版本 {默认安装路径}\bin
```sh
solana --version
solana-keygen --version
spl-token --version
solang --version
```

# 查看配置
```sh
solana config get
```

# 初始化 这个只是笔记

```sh
solana-install-init --help
#=======================================================
  -c, --config ：指定要使用的配置文件的路径。默认路径是 C:\Users\Administrator.config\solana\install\config.yml
  -d, --data-dir ：指定用于存储安装数据的目录的路径。默认路径是 C:\Users\Administrator.local\share\solana\install
  -u, --url <URL>：Solana 集群的 JSON RPC URL。默认为 http://api.devnet.solana.com
  -p, --pubkey <PUBKEY>：更新清单的公钥。
#====================================================
# 尝试初始化
solana-install-init ^
  -c C:\solana-data\config.yml ^
  -d C:\solana-data\install ^
  -u http://api.testnet.solana.com ^
  -p 4Zow4z9RjQTphNNGSa6ivfPE6DQV3UVuJFz53QKUpWpm
```

# 创建钱包 （这个文件钱包 - 最不安的方法 不建议存储大量代币 - 建议只测试）
```sh
mkdir ~/my-solana-wallet
solana-keygen new --outfile ~/my-solana-wallet/my-keypair.json
```

# 通过导入12个词语 生成文件钱包
```sh
solana-keygen recover --force 
  复制12个单词 shift + insert 然后回车 
```
# 导出私钥
  

# 查看公钥
```sh
solana-keygen pubkey C:\solana-data\keypair.json
```

# 可选的 RPC 网络
```sh
https://api.devnet.solana.com
https://api.testnet.solana.com
```

# 设置 连接 目标
```sh
solana config set --url https://api.testnet.solana.com
```
# 领取测试币
```sh
solana airdrop 1 3patsJTnGmAeMMtT2L5t9pKUw2mj79W8Yho4rh9PDpQu -u https://api.testnet.solana.com
```

# 查看账户余额
```sh
solana balance 3patsJTnGmAeMMtT2L5t9pKUw2mj79W8Yho4rh9PDpQu 
```

# 转账
```sh
# solana transfer 
#     --from <转账人钱包中密钥对的路径> <接收人公钥地址> 0.5 ^
#     --allow-unfunded-recipient ^
#     --url https://api.testnet.solana.com ^
#     --fee-payer <转账人钱包中密钥对的路径>

solana transfer ^
    --from C:/solana-data/keypair.json 4Zow4z9RjQTphNNGSa6ivfPE6DQV3UVuJFz53QKUpWpm 0.05 ^
    --allow-unfunded-recipient ^
    --url https://api.testnet.solana.com ^
    --fee-payer C:/solana-data/keypair.json 
```



