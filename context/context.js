import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import {
  collectionFactoryAddress
} from '../config'
import Collection from '../artifacts/contracts/Collection.sol/Collection.json'
import CollectionFactory from '../artifacts/contracts/CollectionFactory.sol/CollectionFactory.json'

const AppContext = createContext();

export function context({ children }) {
    
    const [factory, setFactory] = useState();
    const [nftCollections, setCollections] = useState([]);

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
       }, [factory]);
      
      
      
       async function updateCollections() {
        setCollections([]); 
          let listCollections = await factory.queryFilter(factory.filters.collectionCreated());
          for (let i = 0; i < listCollections.length; i++) {
          let coll = await factory.getOneCollection(i);
          setCollections((Array) => [...Array, ...[[coll[0], coll[1], coll[2]]]]);
        }
        
        
        
       };

  return (
    <AppContext.Provider value={{factory, nftCollections, setCollections}}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}