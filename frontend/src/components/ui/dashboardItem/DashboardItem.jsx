import React from "react";
import { Container, Row, Col } from "reactstrap";
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {nftaddress, nftmarketaddress} from "../../../config";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/NFTMarket.json";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json"; 

import D_NftCard from "../D-Nft-card/D_NftCard";



import "./dashboardItem.css";


const DashboardItem = () => {


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

    const data = await marketContract.fetchMyNFTs()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = { 
        itemId : i.itemId.toNumber(),
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name
      }
      return item
    }))

    setNfts(items) 
    console.log(items);
    setLoadingState('loaded')  
  }

  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs Owned</h1>)
  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="mb-5">
            <h3 className="trending__title">My NFTS</h3>
          </Col>

          {nfts.map((item) => (
            <Col lg="3" md="4" sm="6" key={item.id} className="mb-4">
              <D_NftCard item={item} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default DashboardItem;
