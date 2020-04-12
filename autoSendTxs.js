const { default: Neon, rpc, wallet, tx, u,sc } = require("@cityofzion/neon-js");

txLoop();

async function txLoop(){
  //Neo RPC Node
  const rpcClientA = new rpc.RPCClient("http://47.89.240.111:11332");
  
  //AZZzYNez2oY2VEfqRP8i8rq2d4jduCzxnh
  const wif = "L55NEfPdmuo3zqJyjaC3mCgKqsdMmXVJchYG7binvH2PPYd5P4ES"; 
  const account = new wallet.Account(wif);
  
  //sending crosschain transaction
  while(true){
    await sendCCtx(rpcClientA, account);
    await sleep(60000);
  }
}

async function sendCCtx(rpcClient, account) {
    //Source Chain Nep5Proxey
    const nep5ProxyHash = ""
    
    //Params for Nep5Proxy.lock()
    const sourceAssetHash = "";
    const fromAddress = "";
    const toChainId = 2;
    const toAddress = "";
    
    //构造执行合约的script
    const sb = Neon.create.scriptBuilder();
    var fromAdress = sc.ContractParam.byteArray(fromAddress, "address"); 
    var toChainID = Neon.create.contractParam("Integer", toChainId);
    var toAddress = sc.ContractParam.byteArray(toAddress, "address"); 
    var amount = randomFrom(1, 10) * 100000000;
    sb.emitAppCall(nep5ProxyHash, "lock", [sourceAssetHash, fromAdress, toChainID, toAddress, amount]);
    const script = sb.str;
    
    // create invocatioin transaction
    let invocationTx = Neon.create.invocationTx();
    invocationTx.script = script;

    //add timestamp
    var timestamp = new Date().getTime();
    invocationTx.addAttribute(
        tx.TxAttrUsage.Remark,
        u.str2hexstring(timestamp.toString())
    );
    
    console.log("sending tx: ",invocationTx.hash)
    rpcClient
        .sendRawTransaction(invocationTx)
        .then(response => {
          console.log("success? ",response);
        })
        .catch(err => {
          console.log(err);
        });
  }

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function randomFrom(lowerValue,upperValue)
{
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}