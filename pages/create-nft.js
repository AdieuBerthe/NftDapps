import {
  Contract,
  utils,
} from 'ethers'
import { useState, useContext, useEffect } from 'react'
import { UserContext } from '../context/context'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Collection from '../artifacts/contracts/Collection.sol/Collection.json'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


export default function CreateItem() {
  const { factory, provider, nftCollections, user, formInput, updateFormInput } = useContext(UserContext);
  const [fileUrl, setFileUrl] = useState(null)
  const [ownerCollections, setOwnerCollections] = useState([]);
  const [uploading, setUploading] = useState(false);
  let loaded = false;
  const router = useRouter();




  useEffect(() => {
    (async function () {
      if (user && factory && !loaded) {
        setOwnerCollections([]);
        updateCollections();
        loaded = true;

      };
    })();
  }, [user]);

  async function updateCollections() {
    
    for (let i = 0; i < nftCollections.length; i++) {
      let coll = nftCollections[i];
      if (user === coll[1]) {
        setOwnerCollections((Array) => [...Array, ...[[coll[0], coll[1], coll[2], coll[3]]]]);
      }
    }
  };




  async function onChange(e) {
    /* upload image to IPFS */
    const file = e.target.files[0]
    try {
      setUploading(true);
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
    setUploading(false);
  }
  async function uploadToIPFS() {
    const { name, description, price, collectionID } = formInput
    if (!name || !description || !price || !fileUrl || !collectionID) return
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      return url
    } catch (error) {
      console.log('Error uploading file: ', error)
    }
    
  }

  async function addNft() {

    const url = await uploadToIPFS()
    /* create the NFT */
    const address = formInput.collectionID;
    const signer = provider.getSigner();
    const price = utils.parseUnits(formInput.price, 'ether');
    let contract = new Contract(address, Collection.abi, signer);
    let transaction = await contract.createToken(url, price);
    await transaction.wait();

  }

  const redirect = () => {
    router.push('/collection');
  }

  return (

    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        {ownerCollections.length === 0 && (
        <div className="text-2xl py-2">
          <p>Before creating a nft, you need to create a collection</p>
          <button onClick={redirect} className="font-bold mt-4 bg-blue-800 text-white rounded p-4 shadow-lg" >Create a collection</button>
        </div>
        )}
        {ownerCollections.length > 0 && (<>
          <h2 className="text-2xl py-2">Create a NFT</h2>
          <br />
          <select className='mt-2 border rounded p-4' value={formInput.collectionID} onChange={e => updateFormInput({ collectionID: e.target.value })}>
            <option value="">Select a Collection</option>
            {ownerCollections.map((prop) => {
              return (
                <option key={prop[0]} value={prop[0]}> {prop[2]} </option>
              )
            })}
          </select>
        </>)
        }

        <>
          {formInput.collectionID === '' ? <>

          </>
            : <>
              <input
                placeholder="NFT Name"
                className="mt-8 border rounded p-4"
                onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
              />
              <textarea
                placeholder="NFT Description"
                className="mt-2 border rounded p-4"
                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
              />
              <input
                placeholder="NFT Price in Eth"
                className="mt-2 border rounded p-4"
                onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
              />
              <input
                type="file"
                name="Asset"
                className="my-4"
                onChange={onChange}
              />
              
              <div>
                {
                  fileUrl && (
                    <img className="rounded mt-4" width="350" src={fileUrl} alt='' />
                  )
                }
              </div>
              {uploading ? <div><p>Uploading image...</p></div> : <></>}
              {formInput.name !== '' && formInput.price !== '' && formInput.description !== '' && fileUrl ? <button onClick={addNft} className="font-bold mt-4 bg-blue-800 text-white rounded p-4 shadow-lg">
                Create NFT
              </button> : <p>All fields are required </p>}</>}
        </>



      </div>
    </div>
  )
}