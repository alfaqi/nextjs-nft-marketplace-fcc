import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Button, Form, useNotification } from "web3uikit";
import marketplaceAbi from "../constants/nftMarketplace.json";
import networkMapping from "../constants/networkMapping.json";
import nftAbi from "../constants/BasicNft.json";

import { ethers } from "ethers";

export default () => {
  const { isWeb3Enabled, chainId, account } = useMoralis();
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337";
  const marketplaceAddress = networkMapping[chainIdString].NftMarketplace[0];

  const [proceeds, setProceeds] = useState("0");
  const dispatch = useNotification();
  const { runContractFunction } = useWeb3Contract();

  async function ApproveAndList(data) {
    console.log("Approving...");
    const nftAddress = data.data[0].inputResult;
    const tokenId = data.data[1].inputResult;
    const price = ethers.utils
      .parseUnits(data.data[2].inputResult, "ether")
      .toString();

    const approveOptions = {
      abi: nftAbi,
      contractAddress: nftAddress,
      functionName: "approve",
      params: {
        to: marketplaceAddress,
        tokenId: tokenId,
      },
    };

    await runContractFunction({
      params: approveOptions,
      onSuccess: (tx) => handleApproveSuccess(tx, nftAddress, tokenId, price),
      onError: (error) => {
        console.log(error);
      },
    });

    console.log("Approved!");
  }

  async function handleApproveSuccess(tx, nftAddress, tokenId, price) {
    console.log("Ok! Now time to list");
    await tx.wait();
    const listOptions = {
      abi: marketplaceAbi,
      contractAddress: marketplaceAddress,
      functionName: "listItem",
      params: {
        nftAddress: nftAddress,
        tokenId: tokenId,
        price: price,
      },
    };

    await runContractFunction({
      params: listOptions,
      onSuccess: (tx) => handleListSuccess(tx),
      onError: (error) => console.log(error),
    });
  }

  async function handleListSuccess(tx) {
    await tx.wait(1);
    dispatch({
      type: "success",
      message: "NFT listing",
      title: "NFT listed",
      position: "topR",
    });
  }

  async function mintNft(data) {
    const mintOptions = {
      abi: nftAbi,
      contractAddress: data.data[0].inputResult,
      functionName: "mintNft",
      params: {},
    };

    await runContractFunction({
      params: mintOptions,
      onSuccess: () => {
        getTokenId(data);
      },
    });
  }

  const getTokenId = async (data) => {
    const getTokenIdOptions = {
      abi: nftAbi,
      contractAddress: data.data[0].inputResult,
      functionName: "getTokenId",
      params: {},
    };
    const tokenId = await runContractFunction({
      params: getTokenIdOptions,
      onSuccess: console.log("Returned Token ID"),
    });
    console.log(tokenId);
  };
  const handleWithdrawSuccess = () => {
    dispatch({
      type: "success",
      message: "Withdrawing proceeds",
      position: "topR",
    });
    setupUI();
  };

  async function setupUI() {
    const returnedProceeds = await runContractFunction({
      params: {
        abi: marketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getProceeds",
        params: {
          seller: account,
        },
      },
      onError: (error) => console.log(error),
    });
    if (returnedProceeds) {
      setProceeds(returnedProceeds.toString());
    }
  }

  useEffect(() => {
    setupUI();
  }, [proceeds, account, isWeb3Enabled, chainId]);

  return (
    <>
      <div className="flex  gap-2">
        <Form
          onSubmit={ApproveAndList}
          data={[
            {
              name: "NFT Address",
              type: "text",
              value: "",
              key: "nftAddress",
            },
            {
              name: "Token ID",
              type: "number",
              value: "",
              key: "tokenId",
            },
            {
              name: "Price (in ETH)",
              type: "number",
              value: "",
              key: "price",
            },
          ]}
          title="Sell Your NFT!"
          id="Main Form"
        />
        <Form
          onSubmit={mintNft}
          data={[
            {
              name: "NFT Address",
              type: "text",
              value: "",
              key: "nftAddress",
            },
          ]}
          title="Mint Your NFT!"
          id="Mint Form"
        />
        {/* <Form
        onSubmit={handleApproveSuccess}
        data={[
          {
            name: "NFT Address",
            type: "text",
            value: "",
            key: "nftAddress",
          },
          {
            name: "Token ID",
            type: "number",
            value: "",
            key: "tokenId",
          },
          {
            name: "Price (in ETH)",
            type: "number",
            value: "",
            key: "price",
          },
        ]}
        title="List Your NFT!"
        id="List Form"
      /> */}
      </div>
      <div>Withdraw {ethers.utils.formatEther(proceeds)} proceeds</div>
      {proceeds != "0" ? (
        <Button
          onClick={() => {
            runContractFunction({
              params: {
                abi: marketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "withdrawProceeds",
                params: {},
              },
              onError: (error) => console.log(error),
              onSuccess: () => handleWithdrawSuccess,
            });
          }}
          text="Withdraw"
          type="button"
        />
      ) : (
        <div>No proceeds detected</div>
      )}
    </>
  );
};
