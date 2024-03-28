import("@solana/wallet-adapter-react-ui/styles.css");
import { FC, SetStateAction } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import Logo from "./logo";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface IHeaderProps {
  network: string;
  setNetWork: (value: SetStateAction<WalletAdapterNetwork>) => void;
}
const Header: FC<IHeaderProps> = ({ setNetWork, network }) => {
  const networks = [
    { value: WalletAdapterNetwork.Mainnet, label: "Mainnet" },
    { value: WalletAdapterNetwork.Devnet, label: "Devnet" },
    { value: WalletAdapterNetwork.Testnet, label: "Testnet" },
  ];

  return (
    <div>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur shadow">
        <div className="container flex h-14 items-center max-w-screen-2xl">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <Logo />
              <span className="hidden font-bold sm:inline-block">Alivet</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Select
              onValueChange={(value) => {
                setNetWork &&
                  setNetWork(value as SetStateAction<WalletAdapterNetwork>);
              }}
              value={network}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Network</SelectLabel>
                  {networks.map((i) => (
                    <SelectItem key={i.value} value={i.value}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <WalletMultiButton
              style={{
                backgroundColor: "#C2EFB8",
                color: "#000",
                height: "40px",
              }}
            />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
