import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'


import {
  collectionFactoryAddress
} from '../config'

import CollectionFactory from '../artifacts/contracts/CollectionFactory.sol/CollectionFactory.json'

export default function CreateItem() {
  const [formInput, updateFormInput] = useState({ artistName: '', symbol: '' })
  const [factory, setFactory] = useState();
  const [nftCollections, setCollections] = useState([]);
  const router = useRouter()

 useEffect(() => {
  (async function () {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    setFactory(new ethers.Contract(collectionFactoryAddress, CollectionFactory.abi, signer));
    })();
 }, []);

 useEffect(() => {
  (async function () {
    if(factory) {
    updateCollections();
    }
    })();
 }, []);



 async function updateCollections() {
  setCollections([]); 
    let listCollections = await factory.queryFilter(factory.filters.collectionCreated());
    for (let i = 0; i < listCollections.length; i++) {
    let coll = await factory.getOneCollection(i);
    setCollections((Array) => [...Array, ...[[coll[0], coll[1], coll[2]]]]);
  }  
 };


  async function createCollection() {

   let transaction = await factory.createNFTCollection(formInput.artistName, formInput.symbol);
    await transaction.wait();
    router.push('/create-nft');
    }
   
 

  return (
    
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Artist Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, artistName: e.target.value })}
        />
        <input
          placeholder="Symbol"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, symbol: e.target.value })}
        />
              
        <button onClick={createCollection} className="font-bold mt-4 bg-blue-800 text-white rounded p-4 shadow-lg">
          Create Collection
        </button>
      </div>
    </div>
    
    
  )
}