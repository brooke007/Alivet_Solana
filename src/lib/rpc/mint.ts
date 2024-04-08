import axios from "axios";

const url = `https://mainnet.helius-rpc.com/?api-key=ec7f74b2-9805-43b3-b33e-d51f0c2e06d6`;

interface NftDataProps {
  name: string;
  uri: string;
  owner: string;
  desc: string;
}

const mintCompressedNft = async (data: NftDataProps) => {
  try {
    const response = await axios.post(
      url,
      {
        jsonrpc: "2.0",
        id: "helius-test",
        method: "mintCompressedNft",
        params: {
          name: data.name,
          symbol: "ETFO",
          owner: data.owner,
          description: data.desc,
          attributes: [],
          imageUrl: data.uri,
          sellerFeeBasisPoints: 6900,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.result;
  } catch (error) {
    console.error("Minting error", error);
    throw error; // This allows the caller to handle the error as needed
  }
};

export default mintCompressedNft;
