import React, { useState , useEffect} from "react";
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { Container, Row, Col } from "reactstrap";


import CommonSection from "../components/ui/Common-section/CommonSection";

import NftCard from "../components/ui/Nft-card/NftCard";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Marketplace from "../artifacts/contracts/Marketplace.sol/NFTMarket.json"
import { nftaddress, nftmarketaddress } from "../config";


import "./market.css";


const Market = () => {
  const [nfts, setNfts] = useState([])
  const [nftsData, setNftsData] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [data, setData] = useState([]);


  useEffect(() => {
    loadNFTs()
    console.log(nfts);

  }, [])
   


  async function loadNFTs() {
    //  const rpc = "https://mainnet.infura.io/v3/a868b56432a7470688f879e5ec1b431d"
  
      /* create a generic provider and query for unsold market items */
      const provider = new ethers.providers.JsonRpcProvider()
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
        let currentBid = ethers.utils.formatUnits(i.currentBid.toString(),'ether')
        let item = {
          nftContract:i.nftContract,
          isAuction, 
          currentBid,
          price,
          itemId: i.itemId.toNumber(),
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          category:meta.data.category
        }
        return item
      }))
      setNfts(items)
      setNftsData(items)
      setLoadingState('loaded') 
    }
  
  

/* 
  async function buyNft(nft) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  } */
  const handleItems = () => {};

  //====== SORTING DATA BY HIGH, MID, LOW RATE =========
  const handleSort = (e) => {
    const filterValue = e.target.value;
    console.log(filterValue,"sort")
    if (filterValue === "Sort By") {
     

      setNfts(nftsData);
    }

    if (filterValue === "high") {
      const filterData = nfts.filter((item) => item.price >= 6);

      setNfts(filterData);
    }

    if (filterValue === "mid") {
      const filterData = nfts.filter(
        (item) => item.currentBid >= 5.5 && item.price < 6
      );

      setNfts(filterData);
    }

    if (filterValue === "low") {
      const filterData = nfts.filter(
        (item) => item.currentBid >= 4.89 && item.currentBid < 5.5
      );

      setNfts(filterData);
    }
  };
  const handleSearch= (e) => {
    const filterValue = e.target.value;
    let filterData = nftsData;
    if(filterValue){
       filterData = nfts.filter(
        (item) => item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    setNfts(filterData);
  
  } 

  const handleCategory = (e) => {
    const filterValue = e.target.value;
    console.log(filterValue,"filterValue")
    if(filterValue==="All Categories"){
setNfts(nftsData)
    }

    if (filterValue === "art") {
      const filterData = nfts.filter((item) => item.category==="art");

      setNfts(filterData);
    }

    if (filterValue === "Punk") {
      const filterData = nfts.filter(
        (item) => item.category==='Punk'
      );

      setNfts(filterData);
    }

    if (filterValue === "Cards") {
      const filterData = nfts.filter(
        (item) => item.category==='Cards'
      );

      setNfts(filterData);
    }
    if (filterValue === "Avatars") {
      const filterData = nfts.filter(
        (item) => item.category==='Avatars'
      );

      setNfts(filterData);
    }
    if (filterValue === "Gaming") {
      const filterData = nfts.filter(
        (item) => item.category==='Gaming'
      );

      setNfts(filterData);
    }
    if (filterValue === "none") {
      const filterData = nfts.filter(
        (item) => item.category==='none'
      );

      setNfts(filterData);
    }

    if (filterValue === "Marriage Certificate") {
      const filterData = nfts.filter(
        (item) => item.category==='Marriage Certificate'
      );

      setNfts(filterData);
    }

    



  }; 
  return (
    <>
      <CommonSection title={"MarketPlace"} />

      <section className="market">
        <Container>
          <Row>
            <Col lg="12" className="mb-5">
              <div className="market__product__filter d-flex align-items-center justify-content-between">
                <div className="filter__left d-flex align-items-center gap-5">
                  <div className="all__category__filter">
                    <select  onChange={handleCategory} >
                    <option>All Categories</option>
                      <option value="art">Art</option>
                      <option value="Punk">Punk</option>
                      <option value="Cards">Cards</option>
                      <option value="Avatars">Avatars</option>
                      <option value="Gaming">Gaming</option>
                      <option value="none">none</option>
                      <option value="Marriage Certificate">Marriage Certificate</option>

                    </select>
                  </div>
                </div>

                <div className="all__items__filter">
                    <input className="Market-Search" placeholder="Search..."   onChange={handleSearch} />
                  </div>


                <div className="filter__right">
                  <select onChange={handleSort} >
                    <option>Sort By</option>
                    <option value="high">High Rate</option>
                    <option value="mid">Mid Rate</option>
                    <option value="low">Low Rate</option>
                  </select>
                </div>
              </div>
            </Col>

            {nfts?.map((item) => (
              <Col lg="3" md="4" sm="6" className="mb-4" key={item.id}>
                <NftCard item={item} />
              </Col>
            ))}
          </Row> 
        </Container>
      </section>
    </>
  );
};

export default Market;
