import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import {
  collectionFactoryAddress
} from '../config'

import Collection from '../artifacts/contracts/Collection.sol/Collection.json'
import CollectionFactory from '../artifacts/contracts/CollectionFactory.sol/CollectionFactory.json'


export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [factory, setFactory] = useState();
  const [nftCollections, setCollections] = useState([]);
  const [signer, setSigner] = useState();

  useEffect(() => {
    (async function () {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      setSigner(provider.getSigner());
      
      })();
   }, []);

   useEffect(() => {
    (async function () {
      if(signer) {
      setFactory(new ethers.Contract(collectionFactoryAddress, CollectionFactory.abi, signer));
      }
      })();
   }, [signer]);

   

   useEffect(() => {
    (async function () {
      if(factory) {
      updateCollections();
      }
      })();
   }, [factory]);

   useEffect(() => {
    (async function () {
      if(nftCollections) {
        loadNfts();
      }
    })();
   }, [nftCollections]);

   async function updateCollections() {
    setCollections([]); 
      let listCollections = await factory.queryFilter(factory.filters.collectionCreated());
      for (let i = 0; i < listCollections.length; i++) {
      let coll = await factory.getOneCollection(i);
      setCollections((Array) => [...Array, ...[[coll[0], coll[1], coll[2]]]]);
    }  
   };

   async function loadNfts() {
    
    if(nftCollections.length !== 0) {
      for(let i = 0; i < nftCollections.length; i++) {
    const collection = new ethers.Contract(nftCollections[i][0], Collection.abi, signer)
    const data = await collection.fetchMyNFTs()

    const items = await Promise.all(data.map(async tk => {
      const tokenURI = await collection.tokenURI(tk.tokenId)
      const meta = await axios.get(tokenURI)
      let price = ethers.utils.formatUnits(tk.price.toString(), 'ether')
      let item = {
        price,
        tokenId: tk.tokenId.toNumber(),
        seller: tk.seller,
        owner: tk.owner,
        image: meta.data.image,
        collection: nftCollections[i][1],
        description: meta.data.description,
        tokenURI
      }
      return item
    }))

    setNfts((arr) => [...arr, ...items])
  } 
  setLoadingState('loaded')
}
     
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>)
  return (
    <div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Your NFTs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded" />
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