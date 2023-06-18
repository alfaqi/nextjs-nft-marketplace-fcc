import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";
// import GET_ACTIVE_ITEMS from "@/constants/subgraphQueries";
import { useQuery, gql } from "@apollo/client";

import { Loading } from "web3uikit";
import NFTBoxView from "@/components/NFTBoxView";

const GET_BOUGHT_ITEMS = gql`
  {
    itemBoughts(first: 50) {
      id
      buyer
      nftAddress
      price
      tokenId
    }
  }
`;
export default function BoughtNFTs() {
  const { loading, error, data: boughtNFTs } = useQuery(GET_BOUGHT_ITEMS);
  const [marketplaceAddress, setMarketplaceAddress] = useState("");
  const { isWeb3Enabled, chainId } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
  useEffect(() => {
    // console.log(networkMapping[chainIdString].NftMarketplace[0]);
    if (isWeb3Enabled) {
      setMarketplaceAddress(networkMapping[chainIdString].NftMarketplace[0]);
    }
  }, [isWeb3Enabled]);
  return (
    <div className="container mx-auto">
      {isWeb3Enabled ? (
        <h1 className="py-4 px-4 font-bold text-2xl">NFTs Bought</h1>
      ) : (
        <></>
      )}
      <div className="flex flex-wrap gap-2">
        {isWeb3Enabled ? (
          loading || !boughtNFTs ? (
            <>
              <div
                style={{
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <Loading
                  fontSize={12}
                  size={12}
                  spinnerColor="#2E7DAF"
                  spinnerType="wave"
                  text="Loading..."
                />
              </div>
            </>
          ) : (
            boughtNFTs.itemBoughts.map((nft) => {
              const { nftAddress, tokenId, price, buyer, seller } = nft;
              return (
                <>
                  <NFTBoxView
                    marketplaceAddress={marketplaceAddress}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    price={price}
                    buyer={buyer}
                    seller={seller}
                    key={`${nftAddress}${tokenId}`}
                  />
                </>
              );
            })
          )
        ) : (
          <div>Please connect your wallet</div>
        )}
      </div>
    </div>
  );
}
