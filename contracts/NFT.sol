// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";


contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

       constructor(address marketplaceAddress) ERC721("Ouranos Exchange","OE") {
        contractAddress = marketplaceAddress;
    }

 
      


     function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }  


    function resellToken(uint256 itemId) public  returns (uint) { 
        // return a tokenid  and price  then also aprocall for all again !
         setApprovalForAll(contractAddress, true); 
         return itemId;
    }
 
     




}





