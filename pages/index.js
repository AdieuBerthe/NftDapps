import { Contract, utils } from "ethers";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/context";
import axios from "axios";

import Collection from "../artifacts/contracts/Collection.sol/Collection.json";

const Home = (props) => {
  const { nftCollections, user, provider } = useContext(UserContext);
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  let loaded = false;

  useEffect(() => {
    if (user && nftCollections) {
      loadNFTs();
      loaded = true;
    }
    // eslint-disable-next-line
  }, [user, nftCollections, props.filters]);

  async function loadNFTs() {
    if (!loaded) {
      if (nftCollections.length > 0) {
        setNfts([]);
        for (let i = 0; i < nftCollections.length; i++) {
          const signer = provider.getSigner();
          const collection = new Contract(
            nftCollections[i][0],
            Collection.abi,
            signer
          );
          const data = await collection.fetchMarketItems();
          /*
           *  map over items returned from smart contract and format
           *  them as well as fetch their token metadata
           */
          const items = await Promise.all(
            data.map(async (tk) => {
              const tokenUri = await collection.tokenURI(tk.tokenId);
              const meta = await axios.get(tokenUri);
              let price = utils.formatUnits(tk.price.toString(), "ether");
              if (meta.data.name.startsWith(props.filters.s)) {
                let item = {
                  price,
                  tokenId: tk.tokenId.toNumber(),
                  seller: tk.seller,
                  owner: tk.owner,
                  image: meta.data.image,
                  name: meta.data.name,
                  collection: nftCollections[i][2],
                  description: meta.data.description,
                  address: nftCollections[i][0],
                  tokenUri,
                };
                return item;
              } else {
                return {};
              }
            })
          );
          let displayedItems = items.filter(
            (value) => Object.keys(value).length !== 0
          );
          if (props.filters.sort === "asc" || props.filters.sort === "desc") {
            displayedItems.sort((a, b) => {
              const diff = a.price - b.price;
              if (diff === 0) return 0;
              const sign = Math.abs(diff) / diff; //-1, 1
              return props.filters.sort === "asc" ? sign : -sign;
            });
          }
          setNfts((arr) => [...arr, ...displayedItems]);
        }
      }
      setLoadingState("loaded");
    }
  }
  async function buyNft(nft) {
    const signer = provider.getSigner();
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const contract = new Contract(nft.address, Collection.abi, signer);

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }

  return (
    <div>
      {!user && (
        <h2 className="px-20 py-10 text-3xl text-blue-400">Metamask isn't connected</h2>
      )}

      {user && loadingState === "loaded" && nfts.length === 0 && (
        <h1 className="px-20 py-10 text-3xl text-blue-400">No items in marketplace</h1>
      )}

      {user && loadingState === "loaded" && nfts.length > 0 && (
        <>
          <h1 className="px-20 py-10 text-3xl text-blue-400">Items in marketplace</h1>
          <div className="flex justify-center">
            <div className="px-4" style={{ maxWidth: "1600px" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
                {nfts.map((nft, i) => (
                  <div
                    key={i}
                    className="border shadow rounded-xl overflow-hidden"
                  >
                    <img src={nft.image} alt={nft.name} />
                    <div className="p-4">
                      <p className="text-right">{nft.collection}</p>
                      <p
                        style={{ height: "64px" }}
                        className="text-2xl font-semibold"
                      >
                        {nft.name}
                      </p>
                      <div style={{ height: "70px", overflow: "hidden" }}>
                        <p className="text-gray-400">{nft.description}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-black">
                      <p className="text-2xl font-bold text-white">
                        {nft.price} ETH
                      </p>
                      <button
                        className="mt-4 w-full bg-blue-800 text-white font-bold py-2 px-12 rounded"
                        onClick={() => buyNft(nft)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Home;
