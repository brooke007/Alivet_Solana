import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import Header from "./components/layout/header";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useMemo, useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolongWalletAdapter } from "@solana/wallet-adapter-solong";
import { clusterApiUrl } from "@solana/web3.js";
import Home from "./pages/home";

function App() {
  const DEFAULT_NETWORK = WalletAdapterNetwork.Mainnet;
  const [curNetwork, setCurNetWork] = useState(DEFAULT_NETWORK);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolongWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const endpoint = useMemo(() => clusterApiUrl(curNetwork), [curNetwork]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="h-screen flex flex-col">
            <Header network={curNetwork} setNetWork={setCurNetWork}></Header>
            <main className="flex-1 overflow-hidden">
              <Home />
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
