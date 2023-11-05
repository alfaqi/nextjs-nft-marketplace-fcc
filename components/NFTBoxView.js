import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import marketplaceAbi from "../constants/nftMarketplace.json";
import nftAbi from "../constants/BasicNft.json";
import { Card, useNotification } from "web3uikit";
import Image from "next/image";
// import UpdatingListingModal from "./UpdatingListingModal";

export default ({
  marketplaceAddress,
  nftAddress,
  tokenId,
  buyer,
  price,
  seller,
}) => {
  const [tokenName, setTokenName] = useState("");
  const [tokenImage, setTokenImage] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { isWeb3Enabled, account } = useMoralis();
  const [sellerToken, setSellerToken] = useState("");

  const hideModal = () => setShowModal(false);
  const dispatch = useNotification();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: { tokenId: tokenId },
  });

  const { runContractFunction: getListing } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "getListing",
    params: { nftAddress: nftAddress, tokenId: tokenId },
  });

  async function updateUI() {
    const tokenURI = await getTokenURI();
    if (tokenURI) {
      const tokenURIResponse = await (await fetch(tokenURI)).json();

      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
      setTokenImage(tokenURIResponse.image);
    }
    const transaction = await getListing();
    if (transaction) {
      setSellerToken(transaction.seller);
    }
  }

  const handleBuyItemSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      title: "Item Bought!",
      message: "Item Bought!",
      position: "topR",
    });
    updateUI();
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  return (
    <div>
      {tokenId ? (
        <div>
          {/* <UpdatingListingModal
            marketplaceAddress={marketplaceAddress}
            nftAddress={nftAddress}
            tokenId={tokenId}
            tokenImage={tokenImage}
            tokenName={tokenName}
            price={price}
            isVisible={showModal}
            onClose={hideModal}
          /> */}
          <Card
            title={tokenName}
            description={tokenDescription}
            // tooltipText={tokenName}
            // onClick={handleCardClick}
          >
            <div className="flex flex-col items-end gap-2">
              <div>#{tokenId}</div>
              <div className="italic text-sm">
                NFT Address:{" "}
                {nftAddress.slice(0, 6) + "..." + nftAddress.slice(38, 42)}
              </div>
              {seller ? (
                <div className="italic text-sm">
                  Seller: {seller.slice(0, 6) + "..." + seller.slice(38, 42)}
                </div>
              ) : (
                <></>
              )}
              {buyer ? (
                <div className="italic text-sm">
                  Buyer: {buyer.slice(0, 6) + "..." + buyer.slice(38, 42)}
                </div>
              ) : (
                <></>
              )}
              <Image
                loader={() => tokenImage}
                src={tokenImage}
                alt={tokenName}
                width="200"
                height="200"
              />
              {price ? (
                <div className="font-bold">
                  {ethers.utils.formatEther(price)} ETH
                </div>
              ) : (
                <></>
              )}
            </div>
          </Card>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <div></div>
    </div>
  );
};
