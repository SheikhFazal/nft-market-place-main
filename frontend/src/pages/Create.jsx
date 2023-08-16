import React from "react";

import { Container, Row, Col } from "reactstrap";
import CommonSection from "../components/ui/Common-section/CommonSection";
import "./create-item.css";
import { useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Marketplace from "../artifacts/contracts/Marketplace.sol/NFTMarket.json"
import { nftaddress, nftmarketaddress } from "../config";

import { create } from 'ipfs-http-client'

const projectId = "2GJy34SI3lWGLl8thTBJZecz6u6"
const projectSecret = "56df3cca026a5c93cb9243af6b760d06"
const projectIdAndSecret = `${projectId}:${projectSecret}`
const auth = `Basic ${Buffer.from(projectIdAndSecret).toString('base64')}`

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
})





const Create = () => {

  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '', category: '' })
  const [auctionDays, setAuctionDays] = useState(0);



  async function onChange(e) {

    const file = e.target.files[0]
    try {
        const added = await client.add(file, {
            progress: (prog) => console.log(`received: ${prog}`),
        })

        const url = `https://nihoniho.infura-ipfs.io/ipfs/${added.path}`

        client.pin.add(added.path).then((res) => {
            console.log(res)
            setFileUrl(url)
        })
    } catch (error) {
        console.log('Error uploading file: ', error)
    }
}


  async function uploadToIPFS() {
    const { name, description, price, category } = formInput
    if (!name || !description || !price || !category || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, category, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://nihoniho.infura-ipfs.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    
// next create item
    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber() 
  
// next list the item for market  

    contract = new ethers.Contract(nftmarketaddress, Marketplace.abi, signer)
    transaction = await contract.createMarketItem(nftaddress, tokenId, price)
    await transaction.wait()
   
  }
  
  async function listNFTForSaleAuction() {
    const url = await uploadToIPFS()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
  

   // next create item 
   const price = ethers.utils.parseUnits(formInput.price, 'ether')
   let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
   let transaction = await contract.createToken(url)
   let tx = await transaction.wait()
   let event = tx.events[0]
   let value = event.args[2]
   let tokenId = value.toNumber() 

     //next list the item to the market
    contract = new ethers.Contract(nftmarketaddress, Marketplace.abi, signer)
    transaction = await contract.createMarketAuction(nftaddress,tokenId, price ,auctionDays)
    await transaction.wait()
   
  }










  return (
    <>
      <CommonSection title="Create Item" />

      <section className="creatContainer">
        <Container>
          <Row>
            <Col lg="3" md="4" sm="6">
              <h5 className="mb-4">Preview Item</h5>
              {
                fileUrl && (
                  <img className="rounded " width="250" src={fileUrl} />
                )
              }
            </Col>

            <Col lg="9" md="8" sm="6">
              <div className="create__item">
                <form>






                  <div className="form__input">
                    <label htmlFor="">Name</label>
                    <input type="text" placeholder="Enter title"
                      onChange={e => updateFormInput({ ...formInput, name: e.target.value })}

                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Description...</label>
                    <textarea
                      name=""
                      id=""
                      rows="7"
                      placeholder="Enter description"
                      className="w-100"
                      onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                    >
                    </textarea>
                  </div>



                  <div className="form__input">
                    <label htmlFor="">Upload File</label>
                    <input type="file"
                      className="upload__input"
                      onChange={onChange}


                    />
                  </div>


                  <div className="filter__left d-flex align-items-center gap-5">
                    <div className="all__category__filter create">
                      <select

                        onChange={e => updateFormInput({ ...formInput, category: e.target.value })}

                      >
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






                  <div className="form__input">
                    <label htmlFor="">Price in ETH </label>
                    <input
                      type="number"
                      placeholder="Enter price for one item (ETH)"
                      onChange={e => updateFormInput({ ...formInput, price: e.target.value })}

                    />
                  </div>

                  <div className="form__input">
                    <label htmlFor="">Auction Days</label>
                    <input
                      type="number"
                      placeholder="Days for auction only fill it when using auction"
                      onChange={e => setAuctionDays(e.target.value)}

                    />
                  </div>




                  {/* 
                  <div className="form__input">
                    <label htmlFor="">Minimum Bid</label>
                    <input type="number" placeholder="Enter minimum bid" />
                  </div>
                   */}








                </form>
              </div>

              <div className="button_create" >  <button onClick={listNFTForSale} className="singleNft-btn d-flex  w-25"> Create and Sell  NFT  </button> </div>
              <div className="button_create" >  <button onClick={listNFTForSaleAuction} className="singleNft-btn d-flex  w-25"> Auction and Sell NFT  </button> </div>


            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Create;
