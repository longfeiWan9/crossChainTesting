# 跨链测试使用指南
## 文档结构
1. **setup文件夹**
    
    该文件夹下面有设置Nep5Proxy的所有设置接口和查询接口调用。
    * bindProxy, bindAsset
    * getBindedProxy, getBindedAsset

2. **invokeLock.js**

    发送单笔跨链交易

3. **autoSendTxs.js**

    自动的定时发跨链转账交易


## 使用流程
### 预安装
+ node.js

### 安装依赖
在VS code总打开该文件夹，在terminal下运行下面指令，安装JS所有依赖；
```
npm install @cityofzion/neon-js
```

### 绑定Nep5Proxy
在链上部署成功好Nep5， Nep5Proxy, CCMC后

1. 在`bindProxy.js`中修改调用合约需要的参数，包括A和B两条链；
2. 参数修改好之后，在terminal下运行js, 通过传入参数A或者B指定设置不同链的Proxy。
    ```
    cd setup
    node bindProxy.js A //在A绑定B的Proxy

    //成功返回
    Chain ： [ 'A' ]
    toChainID: 5
    sending tx:  c4a0bc1e94f21fd6ad20b7e229e94dd48d4cca0b7b3a72c36f1f4e1d4b865e32
    success?  true
    ```
3. 两条链都绑定成功以后，可以通过`getBindedProxy.js`查询绑定结果, 同样需要修改相对应链的参数。
    ```
    node getBindedProxy.js A //查看A链

    //成功返回
    Chain ： [ 'A' ]
    toChainID: 5
    bindedProxyHash: d577b781d18bdb577018c430d7cbce03a8965698
    ```
### 绑定nep5资产
1. 在`bindAsset.js`中修改调用合约需要的参数，包括A和B两条链；
2. 参数修改好之后，在terminal下运行js, 通过传入参数A或者B指定设置不同链的Proxy。
    ```
    cd setup
    node bindAsset.js A //在A绑定B的Asset

    //成功返回
    Chain ： [ 'A' ]
    toChainID: 5
    sending tx:  c4a0bc1e94f21fd6ad20b7e229e94dd48d4cca0b7b3a72c36f1f4e1d4b865e32
    success?  true
    ```
3. 两条链都绑定成功以后，可以通过`getBindedAsset.js`查询绑定结果, 同样需要修改相对应链的参数。
    ```
    node getBindedAsset.js A //查看A链绑定资产信息

    //成功返回
    Chain ： [ 'A' ]
    toChainID: 5
    bindedAsset: b09c34e301b131f4a9d4e6d0cd46ad8aaa767bd7
    CrossChain Limit: 00e1f505
    ```

### 发起单笔跨链转账
为完成，待续

### 自动发起跨链转账
为完成，待续