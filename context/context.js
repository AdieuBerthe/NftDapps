import { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";
import { getAddress } from 'ethers/lib/utils';
import { collectionFactoryAddress } from "../config";

import CollectionFactory from "../artifacts/contracts/CollectionFactory.sol/CollectionFactory.json";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [factory, setFactory] = useState();
  const [nftCollections, setCollections] = useState([]);
  const [provider, setProvider] = useState();
  const [user, setUser] = useState();
  const [formInput, updateFormInput] = useState({ collectionID: '', price: '', name: '', description: '' })


  useEffect(() => {
    (async function () {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

        setUser(getAddress(accounts[0]));

        setProvider(new ethers.providers.Web3Provider(window.ethereum));
      }

      window.ethereum.on('accountsChanged', (accounts) => {
        setUser(getAddress(accounts[0]));
        updateFormInput({ collectionID: '' })
      });

    })();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async function () {
      if (provider) {
        const signer = provider.getSigner();
        setFactory(
          new ethers.Contract(
            collectionFactoryAddress,
            CollectionFactory.abi,
            signer
          )
        );
      }
    })();
  }, [provider]);

  useEffect(() => {
    (async function () {
      if (factory) {
        await updateCollections();

        //event collectionCreated(address _collectionAddress, string _artistName, string _artistSymbol );
        await factory.on(
          "collectionCreated",
          async (collectionAddress, owner, artistName, artistSymbol, event) => {
            let newCollections = await nftCollections;
            await newCollections.push([
              collectionAddress,
              owner,
              artistName,
              artistSymbol,
            ]);

            setCollections(newCollections);
          }
        );
      }
    })();
    // eslint-disable-next-line
  }, [factory]);

  async function updateCollections() {
    setCollections([]);
  }

  return (
    <UserContext.Provider
      value={{
        factory,
        user,
        provider,
        nftCollections,
        formInput,
        updateFormInput
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
