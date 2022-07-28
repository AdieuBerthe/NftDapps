import { ethers } from 'ethers'
import { useEffect, useState, useContext } from 'react'
import { UserContext } from "./context";
import axios from 'axios'




import Collection from '../artifacts/contracts/Collection.sol/Collection.json'


export default function Home() {
  const { factory, signer, nftCollections } = useContext(UserContext);
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');


  useEffect(() => {
    loadNFTs()
  }, [nftCollections]);


  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */

    if(nftCollections.length !== 0) {
      setNfts([]);
      for(let i = 0; i < nftCollections.length; i++) {
        
    const collection = new ethers.Contract(nftCollections[i][0], Collection.abi, signer)
    
    const data = await collection.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    
    const items = await Promise.all(data.map(async tk => {
      const tokenUri = await collection.tokenURI(tk.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(tk.price.toString(), 'ether')
      let item = {
        price,
        tokenId: tk.tokenId.toNumber(),
        seller: tk.seller,
        owner: tk.owner,
        image: meta.data.image,
        name: meta.data.name,
        collection: nftCollections[i][1],
        description: meta.data.description,
        address: nftCollections[i][0],
      }
      return item
    }))
    setNfts((arr) => [...arr, ...items]);
    setLoadingState('loaded') 
  }
  }
    
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const contract = new ethers.Contract(nft.address, Collection.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} />
                <div className="p-4">
                <p className='text-right'>{nft.collection}</p>
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">{nft.price} ETH</p>
                  <button className="mt-4 w-full bg-blue-800 text-white font-bold py-2 px-12 rounded" onClick={() => buyNft(nft)}>Buy</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}