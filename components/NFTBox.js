import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import marketplaceAbi from "../constants/NftMarketplace.json";
import nftAbi from "../constants/BasicNft.json";
import { Card, useNotification } from "web3uikit";
import Image from "next/image";
import UpdatingListingModal from "./UpdatingListingModal";

export default ({ marketplaceAddress, nftAddress, tokenId, seller, price }) => {
  const [tokenName, setTokenName] = useState("");
  const [tokenImage, setTokenImage] = useState("");
  const [tokenDescription, setTokenDescription] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { isWeb3Enabled, account } = useMoralis();

  const hideModal = () => setShowModal(false);
  const dispatch = useNotification();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi,
    contractAddress: nftAddress,
    functionName: "tokenURI",
    params: { tokenId: tokenId },
  });

  const { runContractFunction: buyItem } = useWeb3Contract({
    abi: marketplaceAbi,
    contractAddress: marketplaceAddress,
    functionName: "buyItem",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
    msgValue: price,
  });

  async function updateUI() {
    const tokenURI = await getTokenURI();
    console.log(tokenURI);
    if (tokenURI) {
      const tokenURIResponse = await (await fetch(tokenURI)).json();

      setTokenName(tokenURIResponse.name);
      setTokenDescription(tokenURIResponse.description);
      setTokenImage(tokenURIResponse.image);
    }
  }
  const isOwnedByUser = seller === account || seller === undefined;
  const formattedSellerAddress = isOwnedByUser ? "You" : seller;

  const handleCardClick = () => {
    isOwnedByUser
      ? setShowModal(true)
      : buyItem({
          onError: (error) => {
            if (error.message.toLowerCase().includes("insufficient funds")) {
              alert("Insufficient Funds");
              console.log("Insufficient Funds");
              return;
            }
          },
          onSuccess: handleBuyItemSuccess,
        });
  };

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
          <UpdatingListingModal
            marketplaceAddress={marketplaceAddress}
            nftAddress={nftAddress}
            tokenId={tokenId}
            tokenImage={tokenImage}
            tokenName={tokenName}
            price={price}
            isVisible={showModal}
            onClose={hideModal}
          />
          <Card
            title={tokenName}
            description={tokenDescription}
            // tooltipText={tokenName}
            onClick={handleCardClick}
          >
            <div className="flex flex-col items-end gap-2">
              <div>#{tokenId}</div>
              <div className="italic text-sm">
                NFT Address:{" "}
                {nftAddress.slice(0, 6) + "..." + nftAddress.slice(38, 42)}
              </div>

              <div className="italic text-sm">
                Owned by{" "}
                {formattedSellerAddress.slice(0, 6) +
                  "..." +
                  formattedSellerAddress.slice(38, 42)}
              </div>
              <Image
                loader={() => tokenImage}
                src={tokenImage}
                alt={tokenName}
                width="200"
                height="200"
              />
              <div className="font-bold">
                {ethers.utils.formatEther(price)} ETH
              </div>
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
