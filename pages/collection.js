import { useState, useContext } from 'react'
import { UserContext } from "../context/context";
import { useRouter } from 'next/router'


export default function CreateItem() {
  const { factory } = useContext(UserContext);
  const [formInput, updateFormInput] = useState({ artistName: '', symbol: '' })
  const [created, setCreated] = useState(false)
  const router = useRouter();




  async function createCollection() {
    try {
    let transaction = await factory.createNFTCollection(formInput.artistName, formInput.symbol);
    await transaction.wait();
    setCreated(true);
    } catch (error) {
      console.log('Error : ', error)
    }
  }

  const addAnother = () => {
    setCreated(false);
  }

  const redirect = () => {
    router.push('/create-nft');
  }



  return (

    <div className="flex justify-center">
      {!created ? <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Collection Name"
          className="mt-8 border rounded p-4 placeholder:text-slate-600 bg-slate-200 text-slate-800 w-1/3"
          onChange={e => updateFormInput({ ...formInput, artistName: e.target.value })}
        />
        <input
          placeholder="Symbol"
          className="mt-2 border rounded p-4 placeholder:text-slate-600 bg-slate-200 text-slate-800 w-1/3"
          onChange={e => updateFormInput({ ...formInput, symbol: e.target.value })}
        />

         <button onClick={createCollection} className="font-bold mt-4 bg-blue-800 text-white rounded p-4 shadow-lg w-1/3">
          Create Collection
        </button> 
      </div> 
      : 
      <div className="text-2xl py-2">
             
        <p>Collection created ! Why don&apost you add some NFTs to it ?</p>
        <br/>
        <button onClick={redirect} className="font-bold mt-4 bg-blue-800 text-white rounded p-4 shadow-lg mr-2" >Create a NFT</button> 
        <button onClick={addAnother} className="font-bold mt-4 bg-slate-400 text-white rounded p-4 shadow-lg" >Create a new collection</button>
        </div>}
    </div>


  )
}