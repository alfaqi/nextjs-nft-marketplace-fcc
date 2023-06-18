import Link from "next/link";
import { ConnectButton } from "web3uikit";

export default () => {
  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
      <div className="flex flex-row items-center space-x-4">
        <Link className="mr-4 p-6" href="/">
          Home
        </Link>
        <Link className="mr-4 p-6" href="/sell-nft">
          Sell NFT
        </Link>
        <Link className="mr-4 p-6" href="/BoughtNFTs">
          Bought NFTs
        </Link>
        <Link className="mr-4 p-6" href="/AllNFTs">
          All NFTs
        </Link>
        <Link className="mr-4 p-6" href="/CanceledNFTs">
          Canceled NFTs
        </Link>
        <ConnectButton moralisAuth={false} />
      </div>
    </nav>
  );
};
