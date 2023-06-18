import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nftMarketplaceAbi from "../constants/NftMarketplace.json";
import nftAbi from "../constants/BasicNft.json";
import { Button, Card } from "web3uikit";
import Image from "next/image";
import UpdatingListingModal from "./UpdatingListingModal";
const PRICE = ethers.utils.parseEther("0.01");

export default ({ marketplaceAddress, nftAddress, tokenId, seller, price }) => {
  const [imageURI, setImageURI] = useState("");
  const [tokenIdd, setTokenId] = useState(0);
  const [tokenUrii, setTokenUri] = useState("");
  const [ownerOff, setOwnerOf] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  // price = token.value;
  const [tokenName, setTokenName] = useState("");
  const [tokenDescription, setTokenDescrtiption] = useState("");
  const [showModal, setShowModal] = useState(false);
  const hideModal = () => setShowModal(false);

  const { isWeb3Enabled, account } = useMoralis();

  const { runContractFunction: getTokenURI } = useWeb3Contract({
    abi: nftAbi.abi,
    contractAddress: nftAddress,
    functionName: "getTokenURI",
    params: { tokenId: tokenId },
  });

  const { runContractFunction: getTokenId } = useWeb3Contract({
    abi: nftAbi.abi,
    contractAddress: nftAddress,
    functionName: "getTokenId",
    params: { tokenId: tokenId },
  });
  const { runContractFunction: ownerOf } = useWeb3Contract({
    abi: nftAbi.abi,
    contractAddress: nftAddress,
    functionName: "ownerOf",
    params: { tokenId: 2 },
  });
  const { runContractFunction: mintNft } = useWeb3Contract({
    abi: nftAbi.abi,
    contractAddress: nftAddress,
    functionName: "mintNft",
    params: {},
    // msgValue: PRICE,
  });

  const getTokenIdHandler = async () => {
    const aa = await getTokenId();
    // console.log(aa);
    // console.log(tokenId);
    // setTokenId(Number(aa) - 1);
    if (aa == undefined) {
      setTokenId("There is no Token ID");
      return;
    }
    setTokenId(aa.toString());
  };
  const getTokenURIHandler = async () => {
    const aa = await getTokenURI();
    // console.log(aa);
    if (aa == undefined) {
      setTokenUri("There is no URI");
      return;
    }
    setTokenUri(aa.toString());
  };
  const ownerOfHandler = async () => {
    const aa = await ownerOf();
    // console.log(aa);
    if (aa == undefined) {
      setOwnerOf("Invalid token ID");
      return;
    }
    // if (aa === account) {
    //   setOwnerOf("You");
    //   return;
    // }

    setOwnerOf(aa);
    // console.log(aa);
    // console.log(account);
  };
  const mintNftHandler = async () => {
    const aa = await mintNft();
    await aa.wait(1);
    console.log(aa);
  };

  function getImageURL() {
    // console.log(tokenId.image);
  }

  async function updateUI() {
    // setImageUrl(token.image);
    // setTokenName(token.name);
    // setTokenDescrtiption(token.description);
    // price = token.value;
    await ownerOfHandler();
    // getImageURL();
  }
  // seller =
  const isOwnedByUser = seller === account || seller === undefined;
  const formattedSellerAddress = isOwnedByUser ? "You" : seller;

  const handleCardClick = () => {
    console.log(isOwnedByUser);
    isOwnedByUser ? setShowModal(true) : console.log("Let's buy it!");
  };

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);
  return (
    <div>
      {/* <Button text="Get Iamge URL" onClick={getImageURL} />
      <Button text="Get Token ID" onClick={getTokenIdHandler} />
      {tokenIdd ? <div>ID: {tokenIdd}</div> : <div>Loading...</div>}
      <Button text="Get Token URI" onClick={getTokenURIHandler} />
      {tokenUrii ? <div>URI: {tokenUrii}</div> : <div>Loading...</div>}
      <Button text="Owner Of" onClick={ownerOfHandler} />
      {ownerOff ? <div>Owner is: {ownerOff}</div> : <div>Loading...</div>}
      <Button text="Mint NFT" onClick={mintNftHandler} /> */}

      {/* {token.image ? ( */}
      <div>
        <UpdatingListingModal
          nftAddress={nftAddress}
          tokenId={tokenId}
          isVisible={showModal}
          onClose={hideModal}
        />
        <Card
          title={tokenName}
          description={tokenDescription}
          onClick={handleCardClick}
        >
          <div className="flex flex-col items-end gap-2">
            <div>#{tokenId}</div>
            <div className="italic text-sm">
              Owned by{" "}
              {formattedSellerAddress.slice(0, 6) +
                "..." +
                formattedSellerAddress.slice(38, 42)}
            </div>
            {/* <Image
                loader={() => token.image}
                src={token.image}
                alt={token.name}
                width="200"
                height="200"
              /> */}
            <div className="font-bold">{price} ETH</div>
          </div>
        </Card>
      </div>
      {/* ) : (
        <div>Loading...</div>
      )} */}
      <div></div>
    </div>
  );
};
