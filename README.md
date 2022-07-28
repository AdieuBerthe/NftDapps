# NFT Markeplace



```shell
git clone -b antoine https://github.com/AdieuBerthe/NftDapps/
cd NftDapps
npm install
```

Lance Ganache dans un autre terminal. Le network de test natif de hardhat utilise tout le temps les même adresses, ce qui cause des bugs.
Pour déployer sur testnet, crée un .env avec infura_Id et clé privée.

```shell
npx hardhat run scripts/deploy.js --network localhost
npm run dev
```

