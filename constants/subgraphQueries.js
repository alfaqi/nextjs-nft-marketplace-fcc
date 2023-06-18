const { gql } = require("@apollo/client");
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

const GET_CANCELED_ITEMS = gql`
  {
    itemCanceleds {
      id
      seller
      nftAddress
      tokenId
    }
  }
`;
export default { GET_ACTIVE_ITEMS, GET_CANCELED_ITEMS };
