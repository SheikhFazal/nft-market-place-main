import React from "react";
import { useEffect, useState } from 'react'
import CommonSection from "../components/ui/Common-section/CommonSection";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import LiveAuction from "../components/ui/Live-auction/LiveAuction";
import "./nft-details.css";
import { Link, useLocation } from "react-router-dom";
import Modal from "../components/ui/Modal/Modal";



import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Marketplace from "../artifacts/contracts/Marketplace.sol/NFTMarket.json"
import { nftaddress, nftmarketaddress } from "../config";


const NftDetails = (props) => {
  const location = useLocation();
  const { id } = useParams();
  const nft = location.state.nft.nft;
  const [showModal, setShowModal] = useState(false);
  const [loctionVal, setLocationVal] = useState(null);

  useEffect(() => {
    setLocationVal(window.location.href)
  }, []);

  console.log('url', loctionVal)
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(loctionVal)
  }

  // const singleNft = location?.state?.nft?.nft?.find((item) => item.tokenId === id);
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Marketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
    console.log(price);
    const transaction = await contract.createMarketSale(nft.itemId, {
      value: price
    })
    await transaction.wait()
  }

  return (
    <>
      <CommonSection title={location.state.nft.nft.name} />

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6">
              <img
                src={location.state.nft.nft.image}
                alt=""
                className="w-100 single__nft-img"
              />
            </Col>

            <Col lg="6" md="6" sm="6">
              <div className="single__nft__content">
                <h2>{location.state.nft.nft.name}</h2>

                <div className=" d-flex align-items-center justify-content-between mt-4 mb-4">
                  <div className=" d-flex align-items-center gap-4 single__nft-seen">

                  </div>

                  <div className=" d-flex align-items-center gap-2 single__nft-more">
                    {/*  <span>
                      <i class="ri-send-plane-line"></i>
                    </span>
                    <span>
                      <i class="ri-more-2-line"></i>
                    </span> */}
                  </div>
                </div>
                <div>
                  {location.state.nft.nft.isAuction ? <div>
                    <h2>Current Bid</h2>
                    <p>{location.state.nft.nft.currentBid} ETH</p>
                  </div>

                    : <div>
                      <h2>price</h2>
                      <p> {location.state.nft.nft.price}</p>

                    </div>}
                </div>


                <p className="my-4">{location.state.nft.nft.description}</p>
                {/* <button className="singleNft-btn d-flex align-items-center gap-2 w-100">
                  <i class="ri-shopping-bag-line"></i>
                  Place A Bid
                </button> */}
                {location.state.nft.nft.isAuction ? <button
                  className="bid__btn d-flex align-items-center gap-1"
                  onClick={() => setShowModal(true)}
                >
                  <i class="ri-shopping-bag-line"></i> Auction
                </button>

                  : <button
                    className="bid__btn d-flex align-items-center gap-1"
                    onClick={() => buyNft(nft)}
                  >
                    <i class="ri-shopping-bag-line"></i> BUY
                  </button>

                }


                {showModal && <Modal nft={nft} setShowModal={setShowModal} />}




              </div>
              {location &&
                <button
                  title="copy to clipboard"
                  style={{ marginTop: 20 }}
                  className="bid__btn d-flex align-items-center gap-1"
                  onClick={handleCopyUrl}
                > Share
                </button>
              }
            </Col>
          </Row>
        </Container>
      </section>

    </>
  );
};

export default NftDetails;
