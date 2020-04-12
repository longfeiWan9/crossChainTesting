const { default: Neon, rpc, wallet, tx, u,sc } = require("@cityofzion/neon-js");

main(argument = process.argv.splice(2));

function main(chain){
  console.log('Chain ：', chain);
  /**
   * 参数列表
   */ 
  if(chain == "A"){
    bindNep5Proxy(
      url = "http://47.89.240.111:11332",
      wif = "L5YuEAPtQL1VwoPqzBpqEPHpoFNHtK2U5TnHpdGVFm2MtoSuyp3f",
      sourceProxy_Big = "0fb7010af58c2f9407915f182dc5430a0d131e4d",
      sourceAsset_Big = "96734f5efebd87986e1eb68c26b1526e297d91a5",
      toChainID = 11,
      targetAsset_Big = "b09c34e301b131f4a9d4e6d0cd46ad8aaa767bd7",
      newAssetLimit = 100000000,
      isTargetChainAsset = false
    )
  }
  if(chain == "B"){
    bindNep5Proxy(
      url = "http://47.88.50.171:21332",
      wif = "L5YuEAPtQL1VwoPqzBpqEPHpoFNHtK2U5TnHpdGVFm2MtoSuyp3f",
      sourceProxy_Big = "94cca272725dfcab4eaa731615d10f9e58ad49c9",
      sourceAsset_Big = "b09c34e301b131f4a9d4e6d0cd46ad8aaa767bd7",
      toChainID = 10,
      targetAsset_Big = "96734f5efebd87986e1eb68c26b1526e297d91a5",
      newAssetLimit = 100000000,
      isTargetChainAsset = true
    )
  }
}

async function bindNep5Proxy(url, wif, sourceProxy_Big, sourceAsset_Big, toChainID, targetAsset_Big, newAssetLimit, isTargetChainAsset) {
    console.log("toChainID: " + toChainID);
    /**
     * 构造调用合约的交易
     */
    const account = new wallet.Account(wif);
    //Create script
    const sb = Neon.create.scriptBuilder();
    sb.emitAppCall(sourceProxy_Big, 
                    "bindProxyHash", 
                    [u.reverseHex(sourceAsset_Big),//little
                      toChainID, 
                      u.reverseHex(targetAsset_Big),//little
                      newAssetLimit,
                      isTargetChainAsset
                    ]);
    const script = sb.str;
    
    //create invocatioin transaction
    let invocationTx = Neon.create.invocationTx();
    invocationTx.script = script;

    //add timestamp
    var timestamp = new Date().getTime();
    invocationTx.addAttribute(
        tx.TxAttrUsage.Remark,
        u.str2hexstring(timestamp.toString())
    );
    // add attribute to match signature
    invocationTx.addAttribute(
        tx.TxAttrUsage.Script,
        u.reverseHex(wallet.getScriptHashFromAddress(account.address))
    );

    // sign transaction with sender's private key & add witness
    const signature = wallet.sign(
        invocationTx.serialize(false),
        account.privateKey
    );
    invocationTx.addWitness(
        tx.Witness.fromSignature(signature, account.publicKey)
    );
    
    console.log("sending tx: ",invocationTx.hash)
    const rpcClient = new rpc.RPCClient(url); 
    rpcClient
        .sendRawTransaction(invocationTx)
        .then(response => {
          console.log("success? ",response);
        })
        .catch(err => {
          console.log(err);
        });
  }