import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { Button, Illustration, Modal, useNotification } from "web3uikit";
import { ethers } from "ethers";
import Image from "next/image";
import marketplaceAbi from "../constants/NftMarketplace.json";

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
  const dispatch = useNotification();

  const handleBuyItemSuccess = async (tx) => {
    await tx.wait(1);
    dispatch({
      type: "success",
      title: "Item Bought!",
      message: "Item Bought!",
      position: "topR",
    });
  };

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

  return (
    <Modal
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => {
        buyItem({
          onError: (error) => {
            if (error.message.toLowerCase().includes("insufficient funds")) {
              alert("Insufficient Funds");
              console.log("Insufficient Funds");
              return;
            }
          },
          onSuccess: handleBuyItemSuccess,
        });
      }}
      title="NFT Details"
      okText="Buy Item"
      cancelText="Leave it"
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
          <p className="p-4 text-lg">Buy the best NFT NOW.</p>
          <div className="flex flex-col items-end gap-2 border-solid border-2 border-gray-400 rounded p-2 w-fit">
            <div>
              <b>
                {tokenName} #{tokenId}
              </b>
            </div>

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
          <div>
            <p>
              NFT Address:{" "}
              <a
                href={
                  "https://goerli.etherscan.io/address/" + nftAddress + "#code"
                }
                target="_blank"
              >
                {nftAddress}
              </a>
            </p>
            <p>
              Token ID: <b>{tokenId}</b>
            </p>
            <p>
              Token Standard: <b>ERC-721</b>
            </p>
            <p>
              Chain: <b>Ethereum</b>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};
