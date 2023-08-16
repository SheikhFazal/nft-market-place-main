import React from "react";
import { useEffect, useState } from 'react'

import { Container, Row, Col, ListInlineItem } from "reactstrap";
import { Link } from "react-router-dom";

import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {nftaddress, nftmarketaddress} from "../../../config";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/NFTMarket.json";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json"; 



import NftCard from "../Nft-card/NftCard";

import "./live-auction.css";
import { Button } from "bootstrap";

export default function  LiveAuction ()  {

  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
 
 
  useEffect(() => {
    loadNFTs() 
  }, [])


  
   
  async function loadNFTs() {
    // const rpc = "https://mainnet.infura.io/v3/a868b56432a7470688f879e5ec1b431d"
     /* create a generic provider and query for unsold market items */
     const provider = new ethers.providers.JsonRpcProvider();
     const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
     const marketContract = new ethers.Contract(nftmarketaddress, Marketplace.abi, provider)
     const data = await marketContract.fetchMarketItems()
 
 
     /*
     *  map over items returned from smart contract and format 
     *  them as well as fetch their token metadata
     */
     const items = await Promise.all(data.map(async i => {
       const tokenUri = await tokenContract.tokenURI(i.tokenId)
       
       const meta = await axios.get(tokenUri)
       let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
       let isAuction = i.isAuction;
       let currentBid = ethers.utils.formatUnits(i.currentBid.toString(),'ether');
       
       let item = {
        itemId: i.itemId.toNumber(),
        currentBid,
         price,
         isAuction,
         tokenId: i.tokenId.toNumber(),
         seller: i.seller,
         owner: i.owner,
         image: meta.data.image,
         name: meta.data.name,
         description: meta.data.description,
       }
       return item
     }))
     setNfts(items)
   }
  

   


  return (
    <section>
      <Container style={{marginTop:60}}>
        <Row>
          <Col lg="12" className="mb-5">

            <div className="live__auction__top d-flex align-items-center justify-content-between ">
              <h3>Live Auction</h3>
              <span>
                <Link to="/market">Explore more</Link>
              </span>
            </div>
          </Col>

          {nfts.filter(item => item.isAuction == true).map((item) => (
            <Col lg="3" md="4" sm="6" className="mb-4">
              <NftCard  item={item} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

