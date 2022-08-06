const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

describe("CollectionFactory", function () {
  beforeEach(async function () {
    CollectionFactory = await ethers.getContractFactory("CollectionFactory");
    testCollectionFactory = await CollectionFactory.deploy();
  });
  it("Should create a new collecton", async function () {
    const _artistName = "banksy";
    const _artistSymbol = "*";
    //console.log(CollectionFactory);

    expect(
      await testCollectionFactory.createNFTCollection(
        _artistName,
        _artistSymbol
      )
    ).to.be.bignumber;
  });
});
