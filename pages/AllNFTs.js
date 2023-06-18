import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";
import { useQuery, gql } from "@apollo/client";

import { Loading } from "web3uikit";
import NFTBoxView from "@/components/NFTBoxView";

const GET_LISTED_ITEMS = gql`
  {
    itemListeds {
      id
      seller
      nftAddress
      tokenId
      price
    }
  }
`;
export default function AllNFTs() {
  const { loading, error, data: itemListed } = useQuery(GET_LISTED_ITEMS);
  const [marketplaceAddress, setMarketplaceAddress] = useState("");
  const { isWeb3Enabled, chainId } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
  useEffect(() => {
    // console.log(networkMapping[chainIdString].NftMarketplace[0]);
    if (isWeb3Enabled) {
      setMarketplaceAddress(networkMapping[chainIdString].NftMarketplace[0]);
      console.log(loading);
    }
  }, [isWeb3Enabled]);
  return (
    <div className="container mx-auto">
      {isWeb3Enabled ? (
        <h1 className="py-4 px-4 font-bold text-2xl">All Listed NFTs</h1>
      ) : (
        <></>
      )}
      <div className="flex flex-wrap gap-2">
        {isWeb3Enabled ? (
          loading || !itemListed ? (
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
            itemListed.itemListeds.map((nft) => {
              const { seller, nftAddress, tokenId, price, buyer } = nft;
              return (
                <>
                  <NFTBoxView
                    marketplaceAddress={marketplaceAddress}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    price={price}
                    seller={seller}
                    buyer={buyer}
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
