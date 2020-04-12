const { default: Neon, rpc, wallet, tx, u,sc } = require("@cityofzion/neon-js");

main(argument = process.argv.splice(2));
//main("B");

function main(chain){
  console.log('Chain ：', chain);
  /**
   * 参数列表
   */ 
  if(chain == "A"){
    bindNep5Proxy(
      url = "http://47.89.240.111:11332",
      wif = "L5YuEAPtQL1****qEPHpoFNHtK2U5TnHpdGVFm2MtoSuyp3f",
      sourceProxy_Big = "0fb7010af58c2f9407915f182dc5430a0d131e4d",
      targetProxy_Big = "eecca272725dfcab4eaa731615d10f9e58ad49c9",
      toChainID = 11
    )
  }
  if(chain == "B"){
    bindNep5Proxy(
      url = "http://47.88.50.171:21332",
      wif = "L5YuEAPtQL1****qEPHpoFNHtK2U5TnHpdGVFm2MtoSuyp3f",
      sourceProxy_Big = "94cca272725dfcab4eaa731615d10f9e58ad49c9",
      targetProxy_Big = "0fb7010af58c2f9407915f182dc5430a0d1bbbcc",
      toChainID = 10
    )
  }
}

async function bindNep5Proxy(url, wif, sourceProxy_Big, targetProxy_Big, toChainID) {
    console.log("toChainID: " + toChainID);
    /**
     * 构造调用合约的交易
     */
    const account = new wallet.Account(wif);
    //Create script
    const sb = Neon.create.scriptBuilder();
    sb.emitAppCall(sourceProxy_Big, 
                    "bindProxyHash", 
                    [toChainID, u.reverseHex(targetProxy_Big)]);
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