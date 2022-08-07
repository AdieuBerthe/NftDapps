# NFT Markeplace

## Expected links :

Github Pages web site :
xxxxx (à completer ou supprimer)

Git repo :
https://github.com/AdieuBerthe/NftDapps

Demo video :
xxxxx (à completer ou supprimer)

## Setup

Download the project workspace on your local machine.

```bash
git clone -b antoine https://github.com/AdieuBerthe/NftDapps/
cd NftDapps
npm install
```

```bash
npm install @openzeppelin/contracts --save-dev
npm install @openzeppelin/test-helpers --save-dev
npm install @truffle/hdwalletprovider --save-dev
npm install --save-dev eth-gas-reporter
```

As the built in hardhat test network use always the same addresses it might generate some bugs and isn't handy when it comes to test the solution. Therefore we recommand to follow the best practice to deploy on testnet which is to add a .env file at the root folder of the project adding the following keys :

```shell
INFURA_ID = xxx
PRIVATE_KEY = xxx
```

From a new terminal launch Ganache.

```bash
ganache
```

then run

```shell
npx hardhat run scripts/deploy.js --network localhost
npm run dev
```

---

## Solution Built With

- [solidity]
- [Hardhat]
- [Ganache]
- [MateMaks]
- [ipfs]
- [openzeppelin]
- [REACT]
- [Next.js]
- [Tailwind]

---

## Smart Contracts

In order to devlope the Dapp we defined two contract.

### Collection

> it extends ERC721URIStorageUpgradeable from openZeppelin.
> This smart contract allow to create and transfert NFTs.

### CollectionFactory

> This msart contract allow to manage collection of NFTs and the factory associated to the marketPlace.

---

## Front end devlopement

> Development have been based on REACT extended with Next.js and Hardhat.

---

### Use case expressed in the statmeent of work

#### Minimal requirement

- Les NFT utiliseront les implémentations classiques des standards d’openZeppelin
- Vous devrez uploader les métadatas et fichiers sur IPFS
- Les utilisateurs doivent etre capables de voir les nft a la vente, et les nft possédés
- Les collections de NFT seront crées par une NFT factory (utilisant ou non openZeppelin)
- Les utilisateurs auront une page de création de ces collections / des nft dans une collection
- Dans un contrat, on lie à un utilisateur les collections de NFT crées / dans lesquelles il a une balance.
- L’UI est faite sur la plateforme que vous souhaitez (React est très bien)
- Les NFT ont un prix d’achat brut en ETH

**All this fucntionnalities have been implemented.**

#### Aditional requirement

- [ ] Les NFT sont des ERC1155 ayant des caractéristiques on chain personnalisées et ayant un système de rétribution pour son auteur
- [x] Une UI travaillée: par exemple un tri des nft par collections
- [ ] Un système d’encheres
- [ ] Un token de protocole permet l’achat des NFT
- [x] Automated tested are part of the delivery

**All checked fucntionnalities have been implemented.**

---

## Solution improvement:

Use of ERC 20 token ???
