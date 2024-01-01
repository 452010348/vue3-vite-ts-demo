 Solana 测试网上添加 USDT 代币，以下是一些步骤：

1. 安装 Solana CLI：请按照 Solana 官方文档中提供的说明，安装 Solana CLI 工具。确保你已经正确地设置了 Solana 测试网环境。

2. 创建测试网钱包：通过运行以下命令，在 Solana 测试网上创建一个钱包并获取测试币：

```sh
solana-keygen new --outfile keypair.json
solana airdrop 10 <wlt-address>
```
将 `<wlt-address>` 替换为你新创建的钱包地址。

3. 获取 USDT 合约地址：要添加 USDT 代币，你需要获取 USDT 在 Solana 测试网上的合约地址。你可以在 Solana 区块链浏览器上找到 USDT 在测试网上的合约地址。

4. 添加 USDT 代币：通过运行以下命令，使用 Solana CLI 向你的测试网钱包中添加 USDT 代币：

```sh
solana config set --url https://api.testnet.solana.com
spl-token create <usdt-contract-address>
```
将 `<usdt-contract-address>` 替换为你在第三步中获取的 USDT 合约地址。So11111111111111111111111111111111111111112

5. 查看 USDT 余额：运行以下命令，查看你的测试网钱包中的 USDT 余额：

```sh
spl-token balances
```


# 参考： https://cloud.tencent.com/developer/article/2207604

```sh
# 切换网络
$ solana config set --url https://api.testnet.solana.com

# 创建文件钱包 （如果你有了就需要了）
$ solana-keygen new --no-outfile

# 查看公钥
$ solana-keygen pubkey

# 领取
$ solana airdrop 1

# 检查余额
$ solana balance

# 创建 Solana 代币
$ spl-token create-token --decimals 9 --symbol RMB --name CH

    Creating token Dmu6Lk5AZccmRtnmGmqWA1ZBFAmZFRhRdT6fMonbBLNS under program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA

    Address:  Dmu6Lk5AZccmRtnmGmqWA1ZBFAmZFRhRdT6fMonbBLNS
    Decimals:  9

    Signature: 36ZNtK1G8yZ3s5ZYYMX8hawt2izbssRZyJDzNXZtJX2pcPHNG7hofUzmhseCL5AXWJq5CJGfu8ixALxmQokTb8Ua

# 查询代币额度
$ spl-token supply Dmu6Lk5AZccmRtnmGmqWA1ZBFAmZFRhRdT6fMonbBLNS

# 为我们的代币创建的帐户
$ spl-token create-account Dmu6Lk5AZccmRtnmGmqWA1ZBFAmZFRhRdT6fMonbBLNS


# 给代币铸造额度 <token-address> <token-amount>
$ spl-token mint Dmu6Lk5AZccmRtnmGmqWA1ZBFAmZFRhRdT6fMonbBLNS 100


# 列出所有代币额度
$ spl-token accounts


# 代币转移 
spl-token transfer --fund-recipient <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT_ADDRESS>
$ spl-token transfer --fund-recipient Dmu6Lk5AZccmRtnmGmqWA1ZBFAmZFRhRdT6fMonbBLNS 100 3patsJTnGmAeMMtT2L5t9pKUw2mj79W8Yho4rh9PDpQu
```



<!-- 在v1.4.7版本中，以下命令可以创建一个名为MYTOKEN、符号为MT、小数位为6的代币：
之后新版本不可以设置符号 和更改名称
https://github.com/solana-labs/solana/releases/tag/v1.4.7
sh -c "$(curl -sSfL https://release.solana.com/v1.4.7/install)" -->