/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const NFT_STORAGE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVGNkJCODhjNUNDODdiYTAzN2I5MzI3N0EyOTI5ODE4RDI2ZTU2MTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTcxMjQwNTI0MDcyNiwibmFtZSI6ImJyb29rZSJ9.JOU4nP5zPKuYbaRr_EwgrPACEOy--vdja83ZqJ8bMBI";

async function upload(blob: any): Promise<string> {
  const formData = new FormData();
  formData.append("file", blob, "alivet.gif");

  try {
    const response = await axios.post(
      "https://api.nft.storage/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${NFT_STORAGE_KEY}`,
          // Axios 通过 `Content-Type` 自动设置 multipart/form-data
        },
      }
    );
    return response.data.value.cid;
  } catch (error) {
    console.log("upload error", error);
    throw error; // Re-throwing the error to be handled where 'upload' is called
  }
}

async function uploadMetadata(
  wallet: string,
  name: string,
  description: string,
  imageCID: string
): Promise<string> {
  const data = {
    name: "BAndaar FT",
    symbol: "BANDAR",
    description: "Wearing hoodie",

    external_url: "",
    image:
      "https://nftstorage.link/ipfs/bafkreigfd4xpggsiqxjlrvxiktt6lj5ggm3sxm6p3mt6zm64afwe3bexiq",
    attributes: [
      { trait_type: "cap", value: "yellow" },
      { trait_type: "dress", value: "black" },
    ],
    properties: {
      creators: [
        {
          address: "2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc",
          verified: true,
          share: 100,
        },
      ],
      files: [
        {
          uri: "https://nftstorage.link/ipfs/bafkreigfd4xpggsiqxjlrvxiktt6lj5ggm3sxm6p3mt6zm64afwe3bexiq",
          type: "image/png",
        },
      ],
    },
  };
  const metadata = {
    name: name,
    symbol: "ALIVET",
    description: description,
    external_url: "alivet.co",
    image: imageCID,
    attributes: [
      { trait_type: "cap", value: "yellow" },
      { trait_type: "dress", value: "black" },
    ],
    seller_fee_basis_points: 500,
    properties: {
      creators: [
        {
          address: wallet,
          verified: true,
          share: 100,
        },
      ],
      files: [
        {
          uri: imageCID,
          type: "image/gif",
        },
      ],
    },
  };

  try {
    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    const formData = new FormData();
    formData.append("file", blob, "metadata.json");

    // 使用axios上传metadata
    const response = await axios.post(
      "https://api.nft.storage/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${NFT_STORAGE_KEY}`,
          // Axios 通过 `Content-Type` 自动设置 multipart/form-data
        },
      }
    );

    // 返回metadata的CID
    return response.data.value.cid;
  } catch (error) {
    console.log("upload metadata error", error);
    throw error; // Re-throwing the error to be handled where 'uploadMetadata' is called
  }
}
export { upload, uploadMetadata };
