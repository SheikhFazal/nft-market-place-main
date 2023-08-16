require("@nomiclabs/hardhat-waffle");

const projectid = "2GJy34SI3lWGLl8thTBJZecz6u6"

module.exports = {

  solidity: "0.8.3",
  networks: {
 


  /*   mainnet: {
      url : "https://mainnet.infura.io/v3/a868b56432a7470688f879e5ec1b431d",
      accounts:[]
    },
    rinkeby: { 
      url :"https://rinkeby.infura.io/v3/a868b56432a7470688f879e5ec1b431d", 
      accounts:["2ab60ecfb61bd4d4adc0113e1c8940098cb39157ba95e004067b73725586578d"]
      
    }
 */ 
 
     


  },
  paths: {
    // sources: "./marketplace/nft/src/sources",
    // tests: "./marketplace/nft/src/tests",
    artifacts:"../marketplace/nfttwo/src/artifacts",
    cache : "../marketplace/nfttwo/src/cache"
   
   },
 
   solidity: {
     compilers: [
       {
         version: '0.8.3',
         settings: { optimizer: { enabled: true, runs: 200 } },
       },
     ],
   }







};
