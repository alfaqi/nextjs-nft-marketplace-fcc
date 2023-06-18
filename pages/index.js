import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import networkMapping from "../constants/networkMapping.json";
// import { GET_ACTIVE_ITEMS } from "@/constants/subgraphQueries";
import { useQuery, gql } from "@apollo/client";
import NFTBox from "@/components/NFTBox";
import { Loading, Select } from "web3uikit";

export default function Home() {
  const GET_ACTIVE_ITEMS = gql`
    {
      activeItems(
        # first: firstRows
        where: { buyer: "0x0000000000000000000000000000000000000000" }
      ) {
        id
        buyer
        seller
        nftAddress
        price
        tokenId
      }
    }
  `;

  const [marketplaceAddress, setMarketplaceAddress] = useState("");
  const { isWeb3Enabled, chainId } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";

  const { loading, error, data: listedNFTs } = useQuery(GET_ACTIVE_ITEMS);

  // const [firstRows, setFirstRows] = useState(5);
  // console.log(firstRows);

  // function noRefCheck(e) {
  //   console.log(firstRows);
  //   setFirstRows(e.id);
  //   console.log(e.id);
  // }

  useEffect(() => {
    // console.log(networkMapping[chainIdString].NftMarketplace[0]);
    if (isWeb3Enabled) {
      // console.log(chainIdString);
      setMarketplaceAddress(networkMapping[chainIdString].NftMarketplace[0]);
    }
  }, [isWeb3Enabled]);
  return (
    <div className="container mx-auto">
      {isWeb3Enabled ? (
        <>
          <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
          {/* <Select
            label="View Items"
            onChange={noRefCheck}
            options={[
              {
                id: "5",
                label: "5",
              },
              {
                id: "10",
                label: "10",
              },

              {
                id: "25",
                label: "25",
              },
              {
                id: "50",
                label: "50",
              },
              {
                id: "100",
                label: "100",
              },
            ]}
          /> */}
        </>
      ) : (
        <></>
      )}
      <div className="flex flex-wrap gap-2">
        {/* <Button onClick={a}>Click</Button> */}

        {isWeb3Enabled ? (
          loading || !listedNFTs ? (
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
            listedNFTs.activeItems.map((nft) => {
              const { nftAddress, tokenId, price, seller } = nft;
              // console.log(`nft is: ${nftAddress}`);
              return (
                <>
                  <NFTBox
                    marketplaceAddress={marketplaceAddress}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    seller={seller}
                    price={price}
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
