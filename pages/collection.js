import { useState, useContext } from 'react'
import { UserContext } from "./context";
import { useRouter } from 'next/router'


export default function CreateItem() {
  const { factory, signer, nftCollections } = useContext(UserContext);
  const [formInput, updateFormInput] = useState({ artistName: '', symbol: '' })
  const router = useRouter()



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