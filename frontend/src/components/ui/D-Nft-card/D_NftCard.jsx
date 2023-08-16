import React from "react";
import { Link } from "react-router-dom";

import "./d-nft-card.css";
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import SModal from "../SModel/SModel";
import RModal from "../RModel/RModel" 
import TModel from "../TModel/TModel";
import {nftaddress, nftmarketaddress} from "../../../config";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/NFTMarket.json";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json"; 



const D_NftCard = (props) => {

  
    
  
  
  const { name, tokenId, /* creatorImg */  /* creator */  price, description, seller, owner ,image} = props.item;
  const nft = props.item;
  
  const [showModal, setShowModal] = useState(false);
  const [showRModal, setRModal] = useState(false);
  const [showTModal, setTModal] = useState(false);


 
  return (
    <div className="single__nft__card">
      <div className="nft__img">
        <img src={image} alt="this is iamge here" className="w-100" />
      </div>
      
      <div className="nft__content">
        <h5 className="nft__title">
        <Link to={`/market/${tokenId}`} state={{nft:{nft}}}>{name}</Link>
        </h5>

        <div className="creator__info-wrapper d-flex gap-3">
        {/*   <div className="creator__img">
            <img src={creatorImg} alt="" className="w-100" />
          </div> */}

          <div className="creator__info w-100 d-flex align-items-center justify-content-between">
          {/*   <div>
              <h6>Created By</h6>
              <p>{creator}</p>
            </div> */}

            <div>
              <h6>Price</h6>
              <p>{price} ETH</p>
              {/* <p>{seller} ETH</p> */}

            </div>
          </div>
          <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={() => setTModal(true)}
          >
            <i class="ri-shopping-bag-line"></i> transfer
          </button>
        </div>
           
         <div className=" mt-3 d-flex align-items-center justify-content-between">
          <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={() => setShowModal(true)}
          >
            <i class="ri-shopping-bag-line"></i> RESELL
          </button>
          <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={() => setRModal(true)}
          >
            <i class="ri-shopping-bag-line"></i> REAUCTION
          </button>
         

          {showModal && <SModal setShowModal={setShowModal} nft={nft}/>}
          {showRModal && <RModal setRModal={setTModal} nft={nft}/>}
          {showTModal && <TModel setTModal={setTModal} nft={nft}/>}


       
        </div> 
        
      </div>
    </div>
  );
};

export default D_NftCard;
