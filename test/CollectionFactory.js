const { BN } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const { Contract } = require("ethers");

contract("Collection", (accounts) => {
  const ownerAdmin = accounts[0];
  const user1 = accounts[1];

  var createdCollectionAddress;
  let NFTCollection;

  describe("CollectionFactory", function () {
    before(async function () {
      CollectionFactory = await ethers.getContractFactory("CollectionFactory");
      testCollectionFactory = await CollectionFactory.deploy();
    });
    after(async function () {
      let receipt = await NFTCollection.wait();
      receipt.events?.filter((x) => {
        collectionAddress = x.args;
        return x.event == "collectionCreated";
      });
      createdCollectionAddress = collectionAddress[0];
    });
    it("Should create a new collecton", async function () {
      const _artistName = "banksy";
      const _artistSymbol = "*";

      NFTCollection = await testCollectionFactory.createNFTCollection(
        _artistName,
        _artistSymbol
      );

      var collectionAddress;
      let receipt = await NFTCollection.wait();
      receipt.events?.filter((x) => {
        collectionAddress = x.args;
        return x.event == "collectionCreated";
      });

      expect(collectionAddress[0]).to.be.bignumber;
      expect(collectionAddress[1]).to.be.equal(ownerAdmin);
      expect(collectionAddress[2]).to.be.equal(_artistName);
      expect(collectionAddress[3]).to.be.equal(_artistSymbol);
    });

    it("Should return a collection", async function () {
      var collectionAddress;
      let receipt = await NFTCollection.wait();
      receipt.events?.filter((x) => {
        collectionAddress = x.args;
        return x.event == "collectionCreated";
      });

      const localCreatedCollectionAddress = collectionAddress[0];

      let SearchedCollection = await testCollectionFactory.getOneCollection(0);

      expect(SearchedCollection[0]).to.be.equal(localCreatedCollectionAddress);
    });
  });

  describe("Collection", function () {
    before(async function () {
      Collection = await ethers.getContractFactory("Collection");
      deployedtestCollection = await Collection.attach(
        createdCollectionAddress
      );
      buyer = (await ethers.getSigners())[1];
    });

    it("Should return the new token ID", async function () {
      const testUrl = "http://127.0.0.1:8545/test-url";
      const testPrice = 50;

      const createdToken = await deployedtestCollection.createToken(
        testUrl,
        testPrice
      );

      var createdItem;
      let receipt = await createdToken.wait();
      receipt.events?.filter((x) => {
        createdItem = x.args;
        return x.event == "MarketItemCreated";
      });

      expect(createdItem[0]).to.be.equal(1);
      expect(createdItem[1]).to.be.equal(ownerAdmin);
      expect(createdItem[2]).to.be.equal(createdCollectionAddress);
      expect(createdItem[3]).to.be.equal(testPrice);
    });

    it("Should be able to buy a NFT", async function () {
      const createdToken = await deployedtestCollection
        .connect(buyer)
        .createMarketSale(1, {
          value: 50,
        });

      var soldItem;
      let receipt = await createdToken.wait();
      receipt.events?.filter((x) => {
        soldItem = x.args;
        return x.events;
      });

      expect(soldItem[0]).to.be.equal(createdCollectionAddress);
      expect(soldItem[1]).to.be.equal(user1);
    });

    it("Should be able to retrieve my NFTs", async function () {
      const myNFTs = await deployedtestCollection.connect(buyer).fetchMyNFTs();

      expect(myNFTs).to.be.an("array").to.have.lengthOf(1);
      expect(myNFTs[0][0]).to.be.equal(1);
    });
  });
});
