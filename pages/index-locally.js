import NFTBox from "@/components/NFTBox";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Button } from "web3uikit";

// import file01 from "../constants/json/01.json";
import Image from "next/image";

import listNfts from "../constants/json";

// import nftMarketplaceAbi from "../constants/NftMarketplace.json";
// import nftAbi from "../constants/BasicNft.json";

// const basicNft = [
//   "0x0165878A594ca255338adfa4d48449f69242Eb8F",
//   "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
//   "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
//   "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
//   "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
// ];

// const basicNft = [
//   "0x4631BCAbD6dF18D94796344963cB60d44a4136b6",
//   "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
//   "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
//   "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
//   "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
// ];

// `
// nftMarketplace at: 0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3
// basicNft at: 0x7969c5eD335650692Bc04293B07F5BF2e7A673C0
// Minting 11 NFT of NFTs 5...
// basicNft at: 0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc
// Minting 21 NFT of NFTs 5...
// basicNft at: 0x922D6956C99E12DFeB3224DEA977D0939758A1Fe
// Minting 31 NFT of NFTs 5...
// basicNft at: 0x04C89607413713Ec9775E14b954286519d836FEf
// Minting 41 NFT of NFTs 5...
// basicNft at: 0xD8a5a9b31c3C0232E196d518E89Fd8bF83AcAd43
// `;
// const NftMarketplace = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";

const nftAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const NftMarketplace = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const tokenId = 0;

const inter = Inter({ subsets: ["latin"] });
const list = [
  "https://bafybeie4cqvwna35rmcamragvu3xugjx6g7d7owzthey5mx3c5t4jampsu.ipfs.w3s.link/02.json",
  "https://bafybeicsz74lelwejsckd5ho7icawq5qtalaxho3fpbfnb37qddwy36mgq.ipfs.w3s.link/04.json",
  "https://bafybeihhgugfasgfgvv2f2jh554o33akpvcky6kutctzddwhtpx3fvt5r4.ipfs.w3s.link/05.json",
  "https://bafybeicgwevkvyverebsp32w5h4sfu4bn625keiybrxt3kg4zt3nved4ve.ipfs.w3s.link/08.json",
  "https://bafybeibk5ppyb6q2b3dttzuwwvpb2l43ltcb4sbilawrsuszhbu2mmwhnm.ipfs.w3s.link/10.json",
];
export default function Home() {
  const [urls, setUrls] = useState([]);

  const { isWeb3Enabled } = useMoralis();
  // const { runContractFunction: getTokenId } = useWeb3Contract({
  //   abi: nftAbi.abi,
  //   contractAddress: basicNft[1],
  //   functionName: "getTokenId",
  //   params: {},
  // });
  // const a = async () => {
  //   const aa = await getTokenId();
  //   console.log(aa);
  // };

  useEffect(() => {
    // setUrl(list);
    let nfts = [];
    for (const nft in listNfts) {
      nfts.push(listNfts[nft]);
    }
    // console.log(nfts);
    setUrls(nfts);
  }, []);
  return (
    <div className="container mx-auto">
      {isWeb3Enabled ? (
        <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      ) : (
        <></>
      )}
      <div className="flex flex-wrap gap-2">
        {/* <Button onClick={a}>Click</Button> */}

        {isWeb3Enabled ? (
          urls.map((nft) => {
            // console.log(`nft is: ${nft}`);
            return (
              <>
                <NFTBox
                  marketplaceAddress={NftMarketplace}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                  token={nft}
                  // seller={}
                  // price={file01.value}
                  key={`${nftAddress}${tokenId}`}
                />
              </>
            );
          })
        ) : (
          <div>Please connect your wallet</div>
        )}
      </div>
    </div>
  );
}
