import { UserContextProvider } from "../context/context";
import "../styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [filters, setFilters] = useState({
    s: "",
    sort: "",
  });
  const search = async (s) => {
    await setFilters({
      ...filters,
      s,
    });
  };
  function resetSearchFilter() {
    setFilters({
      s: "",
      sort: "",
    });
  }

  const sort = async (sort) => {
    setFilters({
      ...filters,
      sort,
    });
  };
  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-400 bg-slate-900 pb-2">
      <nav className="border-b p-6 text-center">
        <p className="text-4xl font-bold text-blue-400">NFT Marketplace</p>
        <div className="flex justify-center mt-4">
          <Link href="/">
            <a
              onClick={() => resetSearchFilter()}
              className={
                router.pathname === "/"
                  ? "mr-6 underline underline-offset-8 decoration-6"
                  : "mr-6 "
              }
            >
              Home
            </a>
          </Link>
          <Link href="/create-nft">
            <a
              onClick={() => resetSearchFilter()}
              className={
                router.pathname === "/create-nft"
                  ? "mr-6 underline underline-offset-8 decoration-6"
                  : "mr-6"
              }
            >
              Create NFT
            </a>
          </Link>
          <Link href="/collection">
            <a
              onClick={() => resetSearchFilter()}
              className={
                router.pathname === "/collection"
                  ? "mr-6 underline underline-offset-8 decoration-6"
                  : "mr-6"
              }
            >
              Create collection
            </a>
          </Link>
          <Link href="/my-nfts">
            <a
              onClick={() => resetSearchFilter()}
              className={
                router.pathname === "/my-nfts"
                  ? "mr-6 underline underline-offset-8 decoration-6"
                  : "mr-6"
              }
            >
              My NFTs
            </a>
          </Link>
        </div>
      </nav>
      <UserContextProvider>
        {router.pathname === "/" ? (
          <>
          <div className="flex right-8">
            <div className="col-md-12 mb-4 input-group w-1/2 pl-20">
              <input
                className="form-control placeholder:italic placeholder:text-slate-600 block bg-slate-200 border border-slate-300 rounded-md py-2 pl-9 pr-3 w-1/3 mt-2"
                placeholder="Search NFTs by name..."
                onKeyUp={(e) => search(e.target.value)}
              />
              <div className="input-group-append">
                <br />
                <label className="mt-2">Sort by :</label>
                <br />
                <select
                  className="form-select italic text-slate-600 bg-slate-200 rounded-md py-2 pl-9 pr-3 mt-2"
                  onChange={(e) => sort(e.target.value)}
                >
                  <option>Collection</option>
                  <option value="asc">Price Ascending</option>
                  <option value="desc">Price Descending</option>
                </select>
              </div>
              </div>
            </div>
            <Component
              {...pageProps}
              filters={filters}
              setFilters={setFilters}
            />
          </>
        ) : (
          <Component {...pageProps} filters={filters} setFilters={setFilters} />
        )}
      </UserContextProvider>
    </div>
  );
}

export default MyApp;
