import {
    useEffect,
    useState,
    createContext,
  } from 'react';

     import Web3Modal from 'web3modal'
  import { ethers } from 'ethers'
  import {
    collectionFactoryAddress,
  } from '../config'
  
  import CollectionFactory from '../artifacts/contracts/CollectionFactory.sol/CollectionFactory.json'
  
  const UserContext = createContext();
  
  const UserContextProvider = ({ children }) => {
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
           // eslint-disable-next-line
       }, [factory]);
    

       async function updateCollections() {
        setCollections([]); 
          let listCollections = await factory.queryFilter("collectionCreated");
          console.log(listCollections);
          for (let i = 0; i < listCollections.length; i++) {
            console.log(i);
          let coll = await factory.getOneCollection(i);
          setCollections((Array) => [...Array, ...[[coll[0], coll[1], coll[2]]]]);
          
        }  
       };

return (
    <UserContext.Provider value={{
      factory,
      signer,
      nftCollections
    }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };