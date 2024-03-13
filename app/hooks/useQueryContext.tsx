// app/hooks/useQueryContext.tsx
import { useSearchParams } from "@remix-run/react";

export default function useQueryContext() {
  let [searchParams] = useSearchParams();
  const cluster = searchParams.get("cluster");
  type EndpointTypes = "mainnet" | "devnet" | "localnet";
  const endpoint: EndpointTypes = (cluster as EndpointTypes) ?? "mainnet";
  const hasClusterOption = endpoint !== "mainnet";

  const fmtUrlWithCluster = (url: string): string => {
    if (hasClusterOption) {
      const mark = url.includes("?") ? "&" : "?";
      return decodeURIComponent(`${url}${mark}cluster=${endpoint}`);
    }
    return url;
  };

  return {
    fmtUrlWithCluster,
  };
}
