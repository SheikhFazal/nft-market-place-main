// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

     address payable owner;

     constructor() {
          owner = payable(msg.sender);
         }



    struct MarketItem { 
      uint itemId;
      address nftContract;
      uint256 tokenId;
      address payable seller;
      address payable owner;
      address payable currentBidder;
      uint256 price;
      bool sold; 
      bool isAuction;
      uint256 currentBid;

     } 

     
     struct AuctionInfo { 
       uint256 highestBid; 
       address highestBidder; 
       uint256 timeEnding;
     }

    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(uint256 => AuctionInfo) private auctionData;


    event MarketItemCreated ( 
      uint indexed itemId,
      address indexed nftContract,
      uint256 indexed tokenId,
      address seller,
      address owner,
      address currentBidder,
      uint256 price,
      bool sold, 
      bool isAuction,
      uint256 currentBid
      
    ); 

    event MarketItemSold( 
      uint256 indexed tokenId, 
      address indexed nft,
      address seller,
      address owner
    );

    event MarketItemBid( 
      uint256 tokenId, 
      address bidder, 
      uint256 amount
    );


    function createMarketItem(
     address nftContract,
     uint256 tokenId,
     uint256 price
    ) public payable nonReentrant {
      require(price > 0, "Price must be at least 1 wei"); 

      _itemIds.increment();
       uint256 itemId = _itemIds.current(); 


      idToMarketItem[itemId] =  MarketItem(
        itemId, 
        nftContract,
        tokenId,
        payable(msg.sender),
        payable(address(this)),
        payable(address(0)),
        price,
        false, 
        false,
        0
      );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    
      emit MarketItemCreated( 
        itemId,
        nftContract,
        tokenId,
        msg.sender,
        address(this),
        address(0),
        price,
        false, 
        false,
        0
      );
    }

    function createMarketAuction( 
      address nftContract,
      uint256 tokenId, 
      uint256 price, 
      uint auctionDays
    ) public payable nonReentrant { 
      require(price > 0, "Price must be at least 1 wei");
      require(auctionDays > 0, "Auction time can't be 0 days");
  

      _itemIds.increment();
      uint256 itemId = _itemIds.current();

      idToMarketItem[itemId] = MarketItem(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(this)),
      payable(address(0)),
      price,
      false,
      true,
      0
       );

      //setting blank auction for this  MarketItem        
     auctionData[itemId] = AuctionInfo(0,address(0),(block.timestamp + auctionDays*1 days));
  
      IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
    
      emit MarketItemCreated(
        itemId,
        nftContract,
        tokenId,
        msg.sender,
        address(this),
        address(0),
        price,
        false, 
        true,
        0
      );

    }


    function createAuctionBid( uint256 itemId, uint256 price) public payable  nonReentrant{ 
     
      MarketItem storage currentItem = idToMarketItem[itemId];
      AuctionInfo storage currentInfo = auctionData[itemId];
      
        require(!currentItem.sold,"Item has already been sold");
        require(currentItem.isAuction,"Item is not for auction");
        require(price > currentItem.price,"You need to pay more than floor price");
        require(currentInfo.timeEnding > block.timestamp,"Auction has already ended");
        require(price > currentInfo.highestBid,"You need to pay more than current highest bid");
        payable(currentInfo.highestBidder).transfer(currentInfo.highestBid);
        currentInfo.highestBidder = msg.sender; 
        auctionData[itemId].highestBid =  price;
        auctionData[itemId].highestBidder = payable(msg.sender);
        idToMarketItem[itemId].currentBidder = payable(msg.sender);
        idToMarketItem[itemId].currentBid = price;

        
         
         }



      function withdrawbid (uint itemId) public payable nonReentrant { 
           MarketItem storage currentItem = idToMarketItem[itemId];
           AuctionInfo storage currentInfo = auctionData[itemId];
           require(!currentItem.sold,"Item has already been sold");
           require(currentItem.isAuction,"Item is not for auction");
           require(currentInfo.highestBidder == msg.sender);
           payable(currentInfo.highestBidder).transfer(currentInfo.highestBid);
           idToMarketItem[itemId].currentBidder = payable(address(0));
           idToMarketItem[itemId].currentBid = 0;
           auctionData[itemId].highestBid = 0;
           auctionData[itemId].highestBidder =  payable(address(0)); 

         }


   function createAuctionSale(
       uint256 itemId
       )
    public payable nonReentrant { 
        MarketItem storage currentItem = idToMarketItem[itemId];
  
        require(idToMarketItem[itemId].seller == msg.sender, "Only item seler can perform this operation");
        require(!currentItem.sold,"Item has already been sold");
        require(currentItem.isAuction,"Item is not for auction");
        address nftContract = idToMarketItem[itemId].nftContract;
        address highestBidder = idToMarketItem[itemId].currentBidder;
        address seller = currentItem.seller;
        uint tokenId = idToMarketItem[itemId].tokenId;
        uint price = currentItem.currentBid;
        idToMarketItem[itemId].owner = payable(highestBidder);
        idToMarketItem[itemId].sold = true;
        idToMarketItem[itemId].seller = payable(address(0)); 
        idToMarketItem[itemId].currentBidder = payable(address(0));
        idToMarketItem[itemId].currentBid  = 0;
        auctionData[itemId].highestBid = 0;
        auctionData[itemId].highestBidder =  payable(address(0));
        uint commissionNumerator = 25;
        uint commissionDenominator = 1000;
        uint commission = price * commissionNumerator / commissionDenominator;
        uint profit = price - commission;
     //   _transfer(address(this), highestBidder, tokenId);
         IERC721(nftContract).transferFrom(address(this),highestBidder, tokenId);
        payable(owner).transfer(commission);
        payable(seller).transfer(profit);
        _itemsSold.increment();
        
       // emit MarketItemSold(tokenId,currentItem.seller,currentItem.owner);
    }


    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 itemId, uint256 price) public payable nonReentrant {
      MarketItem storage currentItem = idToMarketItem[itemId];
      uint tokenId = idToMarketItem[itemId].tokenId;

      require(idToMarketItem[itemId].owner == msg.sender, "Only item owner can perform this operation");
      address nftContract = idToMarketItem[itemId].nftContract;
      idToMarketItem[itemId].isAuction = false;
      idToMarketItem[itemId].sold = false;
      idToMarketItem[itemId].price = price;
      idToMarketItem[itemId].seller = payable(msg.sender);
      idToMarketItem[itemId].owner = payable(address(this));
      idToMarketItem[itemId].currentBid = 0;
      idToMarketItem[itemId].currentBidder = payable(address(0));


      _itemsSold.decrement();

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);



    }


   function reauctionToken(uint256 itemId, uint256 price ) public payable { 


        require(idToMarketItem[itemId].owner == msg.sender, "Only item owner can perform this operation"); 

        MarketItem storage currentItem = idToMarketItem[itemId];

      address nftContract = idToMarketItem[itemId].nftContract;
      uint tokenId = idToMarketItem[itemId].tokenId;
      idToMarketItem[itemId].sold = false;
      idToMarketItem[itemId].price = price;
      idToMarketItem[itemId].isAuction = true;
      idToMarketItem[itemId].seller = payable(msg.sender);
      idToMarketItem[itemId].owner = payable(address(this));
            idToMarketItem[itemId].currentBid = 0;
                  idToMarketItem[itemId].currentBidder = payable(address(0));



      _itemsSold.decrement();
    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);


      



   }

    // transfer a minted nft to an address 
    function transferit(uint itemId, address recepient) public payable {

            require(idToMarketItem[itemId].owner == msg.sender, "Only item owner can perform this operation"); 
            uint tokenId = idToMarketItem[itemId].tokenId;
            address nftContract = idToMarketItem[itemId].nftContract; 
             idToMarketItem[itemId].owner = payable(address(recepient));
            IERC721(nftContract).transferFrom(msg.sender, address(recepient), tokenId);

          //  _transfer(msg.sender, recepient, itemId);
  

    }
    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(
      uint256 itemId

      ) public payable {
      uint price = idToMarketItem[itemId].price;
      address seller = idToMarketItem[itemId].seller; 
      address nftContract = idToMarketItem[itemId].nftContract;
      require(msg.value == price, "Please submit the asking price in order to complete the purchase");
      uint tokenId = idToMarketItem[itemId].tokenId;
      idToMarketItem[itemId].owner = payable(msg.sender);
      idToMarketItem[itemId].sold = true;
      idToMarketItem[itemId].seller = payable(address(0));
      _itemsSold.increment();
      IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
       uint commissionNumerator = 25;
      uint commissionDenominator = 1000;
      uint commission = price * commissionNumerator / commissionDenominator;
      uint profit = price - price * commissionNumerator / commissionDenominator;
      payable(owner).transfer(commission);
      payable(seller).transfer(profit);

    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
      uint itemCount = _itemIds.current();
      uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
      uint currentIndex = 0;

      MarketItem[] memory items = new MarketItem[](unsoldItemCount);
      for (uint i = 0; i < itemCount; i++) {
        if (idToMarketItem[i + 1].owner == address(this)) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
      uint totalItemCount = _itemIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].owner == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }


      function fetchUserBids() public view returns (MarketItem[] memory){
       uint totalItemCount = _itemIds.current();
       uint itemCount = 0;
       uint currentIndex = 0;

    
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].currentBidder == msg.sender) {
          itemCount += 1;
        }
      }
    MarketItem[] memory items = new MarketItem[](itemCount);
    
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToMarketItem[i + 1].currentBidder == msg.sender) {
        uint currentId = i + 1;
        MarketItem storage currentItem = idToMarketItem[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
      uint totalItemCount = _itemIds.current();
      uint itemCount = 0;
      uint currentIndex = 0;

      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          itemCount += 1;
        }
      }

      MarketItem[] memory items = new MarketItem[](itemCount);
      for (uint i = 0; i < totalItemCount; i++) {
        if (idToMarketItem[i + 1].seller == msg.sender) {
          uint currentId = i + 1;
          MarketItem storage currentItem = idToMarketItem[currentId];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
      }
      return items;
    }
}