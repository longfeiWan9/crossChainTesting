const { default: Neon, rpc, wallet, tx, u,sc } = require("@cityofzion/neon-js");

main(argument = process.argv.splice(2));

function main(chain){
  console.log('Chain ：', chain); 
  /**
   * 参数列比
   */
  if(chain == "A"){
    getBindedProxy(
      url = "http://47.89.240.111:11332",
      sourceProxy_Big = "0fb7010af58c2f9407915f182dc5430a0d131e4d",
      toChainID = 5
    )
  }
  if(chain == "B"){
    getBindedProxy(
      url = "http://47.88.50.171:21332",
      sourceProxy_Big = "d577b781d18bdb577018c430d7cbce03a8965698",
      toChainID = 4
    )
  }
}

async function getBindedProxy(url, sourceProxy_Big, toChainID) {
  console.log("toChainID: " + toChainID);
  //构造执行合约的script
  const sb = Neon.create.scriptBuilder();
  sb.emitAppCall(sourceProxy_Big, 
                  "getProxyHash", 
                  [toChainID]);
  const script = sb.str;
  
  const rpcClient = new rpc.RPCClient(url);
  rpcClient.invokeScript(script)
  .then(response => {
    if(response.stack.length === 0){
      console.log("Execution State: "+ response.state);
    }
    else {
      console.log("bindedProxyHash: "+ u.reverseHex(response.stack[0].value));
    }
    
  })
  .catch(err => {
    console.log(err);
  });
}