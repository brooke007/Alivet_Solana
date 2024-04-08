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

export default upload;
