import React from "react";

import "./Smodel.css";
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {nftaddress, nftmarketaddress} from "../../../config";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/NFTMarket.json";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json"; 




function SModel ({ setShowModal, nft  }) {
  const { name, tokenId, /* creatorImg */  /* creator */  price, description, seller, owner ,image, isAuction} = nft;
  const [sprice,Setprice] = useState(0);

 function setPrices(){ 

console.log(nft);

}


async function placebid() {
  /* needs the user to sign the transaction, so will use Web3Provider and sign it */
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(nftmarketaddress, Marketplace.abi, signer)
  /* user will be prompted to pay the asking proces to complete the transaction */
  console.log(nft.tokenId);
  console.log(sprice);
  const price = ethers.utils.parseUnits(sprice.toString(), 'ether')  
  console.log(price, "this is price"); 
  console.log(nft.tokenId);
  const transaction = await contract.createAuctionBid(nft.itemId,price, {
    value: price
  })
  await transaction.wait()
}
async function listNFTForSale() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    // give contractaddress permission 
       const de = nft.tokenId
       let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
       let  transaction = await contract.resellToken(de);

   //  let tx = await transaction.wait()
    //let event = tx.events[0]
   // let value = event.args[2]


    contract = new ethers.Contract(nftmarketaddress, Marketplace.abi, signer)
    const price = ethers.utils.parseUnits(sprice.toString(), 'ether')  

     transaction = await contract.resellToken(de, price)
    await transaction.wait()



   
  }



  return (
    <div className="modal__wrapper">
      <div className="single__modal">
        <span className="close__modal">
          <i class="ri-close-line" onClick={() => setShowModal(false)}></i>
        </span>
    

        <div className="input__item mb-4">
          <input type="number"  onChange={e => Setprice(e.target.value)}
          />
        </div>

        <button className="place__bid-btn"  onClick={listNFTForSale}>Resell</button>
      </div>
    </div>
  );
};

export default SModel;
