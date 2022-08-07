"use strict";
exports.id = 953;
exports.ids = [953];
exports.modules = {

/***/ 7953:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "S": () => (/* binding */ UserContext),
  "f": () => (/* binding */ UserContextProvider)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: external "ethers"
var external_ethers_ = __webpack_require__(1982);
// EXTERNAL MODULE: external "ethers/lib/utils"
var utils_ = __webpack_require__(2522);
;// CONCATENATED MODULE: ./config.js
const collectionFactoryAddress = "0xc51C462A593D478374C81d355FCF61ADc2cC59dB";

;// CONCATENATED MODULE: ./artifacts/contracts/CollectionFactory.sol/CollectionFactory.json
const CollectionFactory_namespaceObject = JSON.parse('{"Mt":[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"_collectionAddress","type":"address"},{"indexed":false,"internalType":"address","name":"_owner","type":"address"},{"indexed":false,"internalType":"string","name":"_artistName","type":"string"},{"indexed":false,"internalType":"string","name":"_artistSymbol","type":"string"}],"name":"collectionCreated","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"collectionsCreated","outputs":[{"internalType":"address","name":"collectionAddress","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_artistName","type":"string"},{"internalType":"string","name":"_artistSymbol","type":"string"}],"name":"createNFTCollection","outputs":[{"internalType":"address","name":"collectionAddress","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_idCollection","type":"uint256"}],"name":"getOneCollection","outputs":[{"components":[{"internalType":"address","name":"collectionAddress","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"}],"internalType":"struct CollectionFactory.ArtistCollection","name":"","type":"tuple"}],"stateMutability":"view","type":"function"}]}');
;// CONCATENATED MODULE: ./context/context.js






const UserContext = /*#__PURE__*/ (0,external_react_.createContext)();
const UserContextProvider = ({ children  })=>{
    const { 0: factory , 1: setFactory  } = (0,external_react_.useState)();
    const { 0: nftCollections , 1: setCollections  } = (0,external_react_.useState)([]);
    const { 0: provider , 1: setProvider  } = (0,external_react_.useState)();
    const { 0: user , 1: setUser  } = (0,external_react_.useState)();
    const { 0: formInput , 1: updateFormInput  } = (0,external_react_.useState)({
        collectionID: "",
        price: "",
        name: "",
        description: ""
    });
    (0,external_react_.useEffect)(()=>{
        (async function() {
            if (window.ethereum) {
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts"
                });
                setUser((0,utils_.getAddress)(accounts[0]));
                setProvider(new external_ethers_.ethers.providers.Web3Provider(window.ethereum));
            }
            window.ethereum.on("accountsChanged", (accounts)=>{
                setUser((0,utils_.getAddress)(accounts[0]));
                updateFormInput({
                    collectionID: ""
                });
            });
        })();
    // eslint-disable-next-line
    }, []);
    (0,external_react_.useEffect)(()=>{
        (async function() {
            if (provider) {
                const signer = provider.getSigner();
                setFactory(new external_ethers_.ethers.Contract(collectionFactoryAddress, CollectionFactory_namespaceObject.Mt, signer));
            }
        })();
    }, [
        provider
    ]);
    (0,external_react_.useEffect)(()=>{
        (async function() {
            if (factory) {
                await updateCollections();
                //event collectionCreated(address _collectionAddress, string _artistName, string _artistSymbol );
                await factory.on("collectionCreated", async (collectionAddress, owner, artistName, artistSymbol, event)=>{
                    let newCollections = await nftCollections;
                    await newCollections.push([
                        collectionAddress,
                        owner,
                        artistName,
                        artistSymbol, 
                    ]);
                    setCollections(newCollections);
                });
            }
        })();
    // eslint-disable-next-line
    }, [
        factory
    ]);
    async function updateCollections() {
        setCollections([]);
    }
    return /*#__PURE__*/ jsx_runtime_.jsx(UserContext.Provider, {
        value: {
            factory,
            user,
            provider,
            nftCollections,
            formInput,
            updateFormInput
        },
        children: children
    });
};



/***/ })

};
;