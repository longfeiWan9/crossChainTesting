const { default: Neon, rpc, wallet, tx, u,sc } = require("@cityofzion/neon-js");

// main(argument = process.argv.splice(2));
main("A")

function main(chain){
  console.log('Chain ：', chain);
  /**
   * 参数列表
   */ 
  if(chain == "A"){
    sendAssetCrossChain(
      url = "http://47.89.240.111:11332",
      wif = "KwNTRPykwT4****mqvUbGhUw5o6tEHART7wjNCVJhL3kNfqm",
      sourceProxy_Big = "0fb7010af58c2f9407915f182dc5430a0d131e4d",
      sourceAsset_Big = "96734f5efebd87986e1eb68c26b1526e297d91a5",
      toChainID = 5,
      targetAddress = "AKLtW9jWg3CZLkq54g2uyayJTrDs3ah2kG",
      amount = 20000
    )
  }
  if(chain == "B"){
    sendAssetCrossChain(
      url = "http://47.88.50.171:21332",
      wif = "Kwfntp3n9YR****osjJRQidsrGFcmjquF75tonL1zNSCFykj",
      sourceProxy_Big = "d577b781d18bdb577018c430d7cbce03a8965698",
      sourceAsset_Big = "b09c34e301b131f4a9d4e6d0cd46ad8aaa767bd7",
      toChainID = 4,
      targetAddress = "AZPXxnzAMZ58uaETnSkaiiMtvQAwoySBM1",
      amount = 20000
    )
  }
}

async function sendAssetCrossChain(url, wif, sourceProxy_Big, sourceAsset_Big, toChainID, targetAddress, amount) {
    console.log("toChainID: " + toChainID);
    /**
     * 构造调用合约的交易
     */
    const account = new wallet.Account(wif);
    //Create script
    const sb = Neon.create.scriptBuilder();
    sb.emitAppCall(sourceProxy_Big, 
                    "lock", 
                    [u.reverseHex(sourceAsset_Big),//little
                     u.reverseHex(wallet.getScriptHashFromAddress(account.address)),//little
                     toChainID, 
                     u.reverseHex(wallet.getScriptHashFromAddress(targetAddress)),//little
                     amount
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