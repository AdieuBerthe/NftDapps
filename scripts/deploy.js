const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const CollectionFactory = await hre.ethers.getContractFactory("CollectionFactory");
  const collectionFactory = await CollectionFactory.deploy();
  await collectionFactory.deployed();
  console.log("factory deployed to:", collectionFactory.address);

  fs.writeFileSync('./config.js', `
  export const collectionFactoryAddress = "${collectionFactory.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });