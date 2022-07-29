import { UserContextProvider } from '../context/context';
import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav className="border-b p-6 text-center" >
        <p className="text-4xl font-bold">NFT Marketplace</p>
        <div className="flex justify-center mt-4">
          <Link href="/">
            <a className="mr-4 text-blue-800">
              Home
            </a>
          </Link>
          <Link href="/create-nft">
            <a className="mr-6 text-blue-800">
              Create NFT
            </a>
          </Link>
          <Link href="/collection">
            <a className="mr-6 text-blue-800">
              Create collection
            </a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6 text-blue-800">
              My NFTs
            </a>
          </Link>
          </div>
      </nav>
      <UserContextProvider>
      <Component {...pageProps} />
      </UserContextProvider>
    </div>
  )
}

export default MyApp