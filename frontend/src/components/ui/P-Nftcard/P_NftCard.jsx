import React from "react";
import { Link } from "react-router-dom";

import "./p-nft-card.css";
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Modal from "../Modal/Modal";

import {nftaddress, nftmarketaddress} from "../../../config";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/NFTMarket.json";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json"; 



async function buyNft(nft) {
  /* needs the user to sign the transaction, so will use Web3Provider and sign it */
  const web3Modal = new Web3Modal()
  const connection = await web3Modal.connect()
  const provider = new ethers.providers.Web3Provider(connection)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(nftmarketaddress, Marketplace.abi, signer)

  /* user will be prompted to pay the asking proces to complete the transaction */
  const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
  const transaction = await contract.createMarketSale(nft.itemId, {
    value: price
  })
  await transaction.wait()
}

const P_NftCard = (props) => {
  
  const { name, tokenId, /* creatorImg */  /* creator */  price, description, seller, owner ,image} = props.item;
  const nft = props.item;
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="single__nft__card">
      <div className="nft__img">
        <img src={image} alt="this is iamge here" style={{hight:200,width:200}} className="w-100" />
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
        </div>

        {/* <div className=" mt-3 d-flex align-items-center justify-content-between">
          <button
            className="bid__btn d-flex align-items-center gap-1"
            onClick={() => buyNft(nft)}
          >
            <i class="ri-shopping-bag-line"></i> BUY
          </button>

          {showModal && <Modal setShowModal={setShowModal} />}

          <span className="history__link">
            <Link to="#">View History</Link>
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default P_NftCard;
