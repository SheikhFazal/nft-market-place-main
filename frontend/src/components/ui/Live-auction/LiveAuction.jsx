import React from "react";
import { useEffect, useState } from "react";

import { Container, Row, Col, ListInlineItem } from "reactstrap";
import { Link } from "react-router-dom";

import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";

import { nftaddress, nftmarketaddress } from "../../../config";
import Marketplace from "../../../artifacts/contracts/Marketplace.sol/NFTMarket.json";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";

import NftCard from "../Nft-card/NftCard";

import "./live-auction.css";
import { Button } from "bootstrap";

export default function LiveAuction() {
  const [nfts, setNfts] = useState([
    {
      name: "John",
      tokenId: "65487954",
      /* creatorImg */ /* creator */ price: 250,
      description: "nft description",
      seller: "Johnny",
      owner: "William Smith",
      image: "./dummy-nft-pic.avif",
      isAuction: true,
      currentBid: 230,
    },
    {
      name: "John",
      tokenId: "654875483",
      /* creatorImg */ /* creator */ price: 450,
      description: "nft description",
      seller: "Johnny",
      owner: "William Smith",
      image: "./dummy-nft-pic-2.avif",
      isAuction: true,
      currentBid: 125,
    },
    {
      name: "Catherine Doe",
      tokenId: "5484534832",
      /* creatorImg */ /* creator */ price: 350,
      description: "nft description",
      seller: "Johnny Seller",
      owner: "William Smith",
      image: "./dummy-nft-pic-3.avif",
      isAuction: true,
      currentBid: 945,
    },
    {
      name: "Jack",
      tokenId: "7845d4843",
      /* creatorImg */ /* creator */ price: 620,
      description: "nft description",
      seller: "Amelia Seller",
      owner: "Adrian",
      image: "./dummy-nft-pic-4.avif",
      isAuction: true,
      currentBid: 520,
    },
    {
      name: "Alan",
      tokenId: "54456df5g",
      /* creatorImg */ /* creator */ price: 450,
      description: "nft description",
      seller: "Alexander Seller",
      owner: "Anthony",
      image: "./dummy-nft-pic-5.avif",
      isAuction: true,
      currentBid: 350,
    },
    {
      name: "Andrew",
      tokenId: "4568d4xc4843d",
      /* creatorImg */ /* creator */ price: 620,
      description: "nft description",
      seller: "Yvonne Seller",
      owner: "Austin",
      image: "./dummy-nft-pic-6.avif",
      isAuction: true,
      currentBid: 850,
    },
    {
      name: "Tracey",
      tokenId: "3659589sc15d",
      /* creatorImg */ /* creator */ price: 410,
      description: "nft description",
      seller: "Christopher Seller",
      owner: "David",
      image: "./dummy-nft-pic-7.avif",
      isAuction: true,
      currentBid: 154,
    },
    {
      name: "Evan",
      tokenId: "7845njnxsd4843",
      /* creatorImg */ /* creator */ price: 620,
      description: "nft description",
      seller: "Frank Seller",
      owner: "Wanda",
      image: "./dummy-nft-pic-8.avif",
      isAuction: true,
      currentBid: 350,
    },
    {
      name: "Peter",
      tokenId: "78kjh45d4843",
      /* creatorImg */ /* creator */ price: 620,
      description: "nft description",
      seller: "Phil Seller",
      owner: "Stephen",
      image: "./dummy-nft-pic-9.avif",
      isAuction: true,
      currentBid: 128,
    },
    {
      name: "Jonathan",
      tokenId: "7845dsde4843",
      /* creatorImg */ /* creator */ price: 420,
      description: "nft description",
      seller: "Joseph Seller",
      owner: "Eric",
      image: "./dummy-nft-pic-10.avif",
      isAuction: true,
      currentBid: 780,
    },
    {
      name: "James",
      tokenId: "jkdnj554535d4f5",
      /* creatorImg */ /* creator */ price: 240,
      description: "nft description",
      seller: "Jason Seller",
      owner: "Joe",
      image: "./dummy-nft-pic-11.avif",
      isAuction: true,
      currentBid: 255,
    },
    {
      name: "Harry",
      tokenId: "9598545d45f45f1",
      /* creatorImg */ /* creator */ price: 990,
      description: "nft description",
      seller: "Isaac Seller",
      owner: "Jake",
      image: "./dummy-nft-pic-12.avif",
      isAuction: true,
      currentBid: 240,
    },
  ]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  // useEffect(() => {
  //   loadNFTs()
  // }, [])

  async function loadNFTs() {
    // const rpc = "https://mainnet.infura.io/v3/a868b56432a7470688f879e5ec1b431d"
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Marketplace.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);

        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let isAuction = i.isAuction;
        let currentBid = ethers.utils.formatUnits(
          i.currentBid.toString(),
          "ether"
        );

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
        };
        return item;
      })
    );
    setNfts(items);
  }

  return (
    <section>
      <Container style={{ marginTop: 60 }}>
        <Row>
          <Col lg="12" className="mb-5">
            <div className="live__auction__top d-flex align-items-center justify-content-between ">
              <h3>Live Auction</h3>
              <span>
                <Link to="/market">Explore more</Link>
              </span>
            </div>
          </Col>

          {nfts
            .filter((item) => item.isAuction == true)
            .map((item) => (
              <Col lg="3" md="4" sm="6" className="mb-5">
                <NftCard item={item} />
              </Col>
            ))}
        </Row>
      </Container>
    </section>
  );
}
