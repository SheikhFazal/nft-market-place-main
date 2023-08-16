import React from "react";
import { Container, Row, Col } from "reactstrap";
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import "./dashboardauctioned.css";

import AD_NftCard from "../Adcard/Adcardnft";


import {nftaddress, nftmarketaddress} from "../../../config";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/NFTMarket.json";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json"; 




const DashboardAuctioned = () => {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])
  
  async function loadNFTs() {
    const web3Modal = new Web3Modal() 
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const marketContract = new ethers.Contract(nftmarketaddress, Marketplace.abi, signer)
   
    const data = await marketContract.fetchUserBids();


   /*  const data = await marketContract.fetchUserBids();
    const nfts = data[0];
    const info = data[1]; */
   


   const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let isAuction = i.isAuction;
      let currentBid = ethers.utils.formatUnits(i.currentBid.toString(), 'ether');
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
      let item = { 
        currentBid,
        isAuction,
        price,
        itemId: i.itemId.toNumber(),
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        name: meta.data.name,
        image: meta.data.image,
      }
      return item
    }))

    setNfts(items) 
    setLoadingState('loaded')  

 
  }


  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs you auctioned on !</h1>)

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <h3 className="trending__title">Items you Auctioned on </h3>
          </Col>

          {nfts.filter(item => item.isAuction == true ).map((item) => (
            <Col lg="3" md="4" sm="6" key={item.id} className="mb-4">
              <AD_NftCard  item={item} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default DashboardAuctioned;
