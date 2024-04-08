import axios from "axios";

const url = `https://mainnet.helius-rpc.com/?api-key=f46e7c57-a4d4-43b0-b65b-1f287e2380cb`;

const mintCompressedNft = async (
  wallet: string,
  name: string,
  desc: string,
  img: string
) => {
  try {
    const response = await axios.post(
      url,
      {
        jsonrpc: "2.0",
        id: "helius-test",
        method: "mintCompressedNft",
        params: {
          name: name,
          symbol: "ALIVET",
          owner: wallet,
          description: desc,
          attributes: [],
          imageUrl: img,
          externalUrl: "",
          sellerFeeBasisPoints: 6900,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Minted asset: ", response.data.result.assetId);
  } catch (error) {
    console.error("Error minting asset:", error);
  }
};

export default mintCompressedNft;
