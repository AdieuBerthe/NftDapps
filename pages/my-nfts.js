import {
  Contract,
  utils,
} from 'ethers'
import { useEffect, useState, useContext } from 'react'
import { UserContext } from '../context/context'
import axios from 'axios'



import Collection from '../artifacts/contracts/Collection.sol/Collection.json'



export default function MyAssets() {
  const { provider, nftCollections } = useContext(UserContext);
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  let loaded = false;


  useEffect(() => {
    loadNfts();
    // eslint-disable-next-line
  }, [loadingState]);


  async function loadNfts() {

    if (!loaded) {
      if (nftCollections.length > 0) {

        setNfts([]);
        for (let i = 0; i < nftCollections.length; i++) {
          const signer = provider.getSigner();
          const collection = new Contract(nftCollections[i][0], Collection.abi, signer)
          const data = await collection.fetchMyNFTs()

          const items = await Promise.all(data.map(async tk => {
            const tokenURI = await collection.tokenURI(tk.tokenId)
            const meta = await axios.get(tokenURI)
            let price = utils.formatUnits(tk.price.toString(), 'ether')
            let item = {
              price,
              tokenId: tk.tokenId.toNumber(),
              seller: tk.seller,
              owner: tk.owner,
              name: meta.data.name,
              image: meta.data.image,
              collection: nftCollections[i][2],
              description: meta.data.description,
              tokenURI
            }

            return item


          }))
          setNfts((arr) => [...arr, ...items])

        }
        setLoadingState('loaded')
        loaded = true;
      }

    }
  }


  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>)
  return (
    <div>
      <div className="p-4" style={{ maxWidth: '1600px' }}>

        <h2 className="text-2xl py-2">Your NFTs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} alt={nft.name} className="rounded" />
                <div className="p-4">
                  <p className='text-right'>{nft.collection}</p>
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Price - {nft.price} Eth</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}