import { Helius } from "helius-sdk";
const TOKEN = "f46e7c57-a4d4-43b0-b65b-1f287e2380cb";
const helius = new Helius(TOKEN);

const getNFT = async (wallet: string, page: number) => {
  console.log(wallet,page)
  const res = await helius.rpc.getAssetsByOwner({
    ownerAddress: wallet,
    page: page,
  });
  return res.items;
}

export {
  getNFT
}