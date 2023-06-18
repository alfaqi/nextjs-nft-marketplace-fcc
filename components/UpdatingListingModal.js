import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { Button, Illustration, Input, Modal, useNotification } from "web3uikit";
import { ethers } from "ethers";
import nftMarketplace from "../constants/nftMarketplace.json";
import Image from "next/image";

export default ({
  marketplaceAddress,
  nftAddress,
  tokenId,
  tokenImage,
  tokenName,
  price,
  isVisible,
  onClose,
}) => {
  const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0);

  const dispatch = useNotification();
  const handleSuccessing = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      title: "Listing Updated",
      message: "Listing updated - please refresh (and move blocks)",
      position: "topR",
    });
    onClose && onClose();
    setPriceToUpdateListingWith("0");
  };

  const handleCancelListingSuccess = async (tx) => {
    await tx.wait(1);

    dispatch({
      type: "success",
      message: "Listing canceled successfully",
      title: "Listing Canceled",
      position: "topR",
    });
    onClose && onClose();
  };

  const { runContractFunction: updateListing } = useWeb3Contract({
    abi: nftMarketplace,
    contractAddress: marketplaceAddress,
    functionName: "updateListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
      newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
    },
  });

  const { runContractFunction: cancelListing } = useWeb3Contract({
    abi: nftMarketplace,
    contractAddress: marketplaceAddress,
    functionName: "cancelListing",
    params: {
      nftAddress: nftAddress,
      tokenId: tokenId,
    },
  });

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => {
        updateListing({
          onSuccess: handleSuccessing,
          onError: (error) => {
            console.log(error);
          },
        });
      }}
      title="NFT Details"
      okText="Save new listing price"
      cancelText="Leave it"
      isOkDisabled={!priceToUpdateListingWith}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <p className="p-4 text-lg">
            This is your listing. You may either update the listing price of
            cancel it.
          </p>
          <div className="flex flex-col items-end gap-2 border-solid border-2 border-gray-400 rounded p-2 w-fit">
            <div>#{tokenId}</div>

            {tokenImage ? (
              <Image
                loader={() => tokenImage}
                src={tokenImage}
                alt={tokenName}
                width="200"
                height="200"
              />
            ) : (
              <Illustration height="180px" logo="lazyNft" width="100%" />
            )}
            <div className="font-bold">
              {ethers.utils.formatEther(price || "0")} ETH
            </div>
          </div>
          <Input
            label="Update listing price in L1 Currency (ETH)"
            name="New listing price"
            type="number"
            onChange={(e) => {
              setPriceToUpdateListingWith(e.target.value);
            }}
          />
          or
          <Button
            onClick={() => {
              cancelListing({
                onSuccess: handleCancelListingSuccess,
                onError: (e) => console.log(e),
              });
            }}
            text="Cancel Listing"
            theme="colored"
            color="red"
            type="button"
          />
        </div>
      </div>
    </Modal>
  );
};
