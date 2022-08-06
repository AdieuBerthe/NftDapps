const { BN, expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");

describe("Collection", function () {
  beforeEach(async function () {
    Collection = await ethers.getContractFactory("Collection");
    testCollection = await Collection.deploy();
  });

  it("Should return the new token ID", async function () {
    const testUrl = "http://127.0.0.1:8545/test-url";
    const testPrice = new BN(50);

    expect(await Collection.createToken(testUrl, testPrice)).to.be.bignumber;
    console.log(testCollection);
    //expect(await testCollection["createToken(string, uint256)"](testUrl, testPrice)).to.be.bignumber;
  });
});
