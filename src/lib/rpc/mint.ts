const url = `https://mainnet.helius-rpc.com/?api-key=ec7f74b2-9805-43b3-b33e-d51f0c2e06d6`;

interface NftDataProps {
  name: string;
  uri: string;
  owner: string;
  description: string;
}

const mintCompressedNft = async (data: NftDataProps) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "helius-test",
      method: "mintCompressedNft",
      params: {
        name: data.name,
        symbol: "ETFO",
        owner: data.owner,
        description: data.description,
        attributes: [],
        imageUrl: data.uri,
        sellerFeeBasisPoints: 6900,
      },
    }),
  });
  const { result } = await response.json();
  return result;
};

export default mintCompressedNft;
