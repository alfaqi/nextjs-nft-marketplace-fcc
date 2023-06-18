import { useQuery, gql } from "@apollo/client";
import React from "react";

const GET_ACTIVE_ITEMS = gql`
  {
    activeItems(
      first: 5
      where: { buyer: "0x0000000000000000000000000000000000000000" }
    ) {
      id
      buyer
      seller
      nftAddress
      price
    }
  }
`;

export default function graphEx() {
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS);
  console.log(data);
  return <div>graphEx</div>;
}
