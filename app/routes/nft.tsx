import { json, useLoaderData } from "@remix-run/react";
import { Helius } from "helius-sdk";

const wallet = "DrwvEExuVvrJgp1mZw6DYGYoLEeYoLYYFr3RTQv6Tn4e";
const helius = new Helius("your api key");


// nft.tsx
export const loader = async () => {
  const response = await helius.rpc.getAssetsByOwner({
    ownerAddress: wallet,
    page: 1,
  });
  return json(response.items);
};

export default function NFT() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="p-4">
      <h1>gm! Here are your NFTs</h1>
      <ul>
        {data.map((nft) => (
          <li key={nft.id}>
            <div className="max-w-sm  m-2 rounded overflow-hidden shadow-lg">
              <img
                className="w-full"
                src={nft.content?.files?.[0]?.cdn_uri}
                alt={nft.content?.metadata.description}
              />
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">
                  {nft.content?.metadata.name}
                </div>
                <p className="text-gray-700 text-base">
                  {nft.content?.metadata.description}
                </p>
              </div>
              <div className="px-6 pt-4 pb-2">
                {nft.content?.metadata.attributes &&
                  nft.content?.metadata.attributes?.map((trait) => (
                    <span
                      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      key={trait["trait_type"]}
                    >
                      {trait["trait_type"]}: {trait.value}
                    </span>
                  ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
