import React from "react";

import "./tmodel.css";
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {nftaddress, nftmarketaddress} from "../../../config";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/NFTMarket.json";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json"; 




function TModel ({ setTModal, nft  }) {
  const { name, tokenId, /* creatorImg */  /* creator */  price, description, seller, owner ,image, isAuction} = nft;
  const [address,Setaddress] = useState(0);


 async function transfer() {
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

    transaction = await contract.transferit(de, address)
    await transaction.wait()



   
  }
 


  return (
    <div className="modal__wrapper">
      <div className="single__modal">
        <span className="close__modal">
          <i class="ri-close-line" onClick={() => setTModal(false)}></i>
        </span>
      

        <div className="input__item mb-4">
        <h6> Type the address here </h6>

          <input type="string"  onChange={e => Setaddress(e.target.value)}
          />
        </div>

        <button className="place__bid-btn"  onClick={transfer}>Tranfer</button>
      </div>
    </div>
  );
};

export default TModel;
