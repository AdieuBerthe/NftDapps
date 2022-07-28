import { useState, useContext } from 'react'
import { UserContext } from '../context/context'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'


const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')



import Collection from '../artifacts/contracts/Collection.sol/Collection.json'


export default function CreateItem() {
  const { signer, nftCollections } = useContext(UserContext);
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ collectionID: '', price: '', name: '', description: '' })






  async function onChange(e) {
    /* upload image to IPFS */
    const file = e.target.files[0]
    try {
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
    console.log(address);
    const price = ethers.utils.parseUnits(formInput.price, 'ether');
    let contract = new ethers.Contract(address, Collection.abi, signer);
    let transaction = await contract.createToken(url, price);
    await transaction.wait();

  }

  return (

    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
                   <select className='mt-2 border rounded p-4' value={formInput.collectionID} onChange={e => updateFormInput({ collectionID: e.target.value })}>
                    <option value="">Select a Collection</option>
                    {nftCollections.map((prop) => {
                      return (
                        <option key={prop[0]} value={prop[0]}> {prop[1]} </option>
                      )
                    })}
                  </select>
                  
          
        <>
        {formInput.collectionID === '' ? <>
          
        </>
         :<>
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
        <button onClick={addNft} className="font-bold mt-4 bg-blue-800 text-white rounded p-4 shadow-lg">
          Create NFT
        </button></>}
        </>
        
        
        
      </div>
    </div>
  )
}