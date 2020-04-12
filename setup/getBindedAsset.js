const { default: Neon, rpc, wallet, tx, u,sc } = require("@cityofzion/neon-js");

main(argument = process.argv.splice(2));

async function main(chain){
  console.log('Chain ：', chain); 
  /**
   * 参数列比
   */
  if(chain == "A"){
    await getBindedAsset(
      url = "http://47.89.240.111:11332",
      sourceProxy_Big = "0fb7010af58c2f9407915f182dc5430a0d131e4d",
      sourceAsset_Big = "96734f5efebd87986e1eb68c26b1526e297d91a5",
      toChainID = 5
    )
  }
  if(chain == "B"){
    await getBindedAsset(
      url = "http://47.88.50.171:21332",
      sourceProxy_Big = "94cca272725dfcab4eaa731615d10f9e58ad49c9",
      sourceAsset_Big = "b09c34e301b131f4a9d4e6d0cd46ad8aaa767bd7",
      toChainID = 4
    )
  }
}

async function getBindedAsset(url, sourceProxy_Big, sourceAsset_Big, toChainID) {
  console.log("toChainID: " + toChainID);
  //构造执行合约的script
  const sb = Neon.create.scriptBuilder();
  sb.emitAppCall(sourceProxy_Big, 
                  "getAssetHash", 
                  [u.reverseHex(sourceAsset_Big), toChainID]);
  const script = sb.str;
  
  const rpcClient = new rpc.RPCClient(url);
  await rpcClient.invokeScript(script)
  .then(response => {
    if(response.stack.length === 0){
      console.log("Execution State: "+ response.state);
    }
    else {
      console.log("bindedAsset: "+ u.reverseHex(response.stack[0].value));
    }
  })
  .catch(err => {
    console.log(err);
  });
  await getCrossedLimit(url, sourceProxy_Big, sourceAsset_Big, toChainID);
}

async function getCrossedLimit(url, sourceProxy_Big, sourceAsset_Big, toChainID) {
  //构造执行合约的script
  const sb = Neon.create.scriptBuilder();
  sb.emitAppCall(sourceProxy_Big, 
                  "getCrossedLimit", 
                  [u.reverseHex(sourceAsset_Big), toChainID]);
  const script = sb.str;
  
  const rpcClient = new rpc.RPCClient(url);
  await rpcClient.invokeScript(script)
  .then(response => {
    if(response.stack.length === 0){
      console.log("Execution State: "+ response.state);
    }
    else {
      const crosschainLimit = response.stack[0].value;
      console.log("CrossChain Limit: "+ u.fixed82num(crosschainLimit));
    }
  })
  .catch(err => {
    console.log(err);
  });
}