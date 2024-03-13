// app/components/NetworkSwitcher.tsx
import { FC } from 'react';
import { useNetworkConfiguration } from '~/contexts/NetworkConfigurationProvider'; // 调整了路径

const NetworkSwitcher: FC = () => {
  const { networkConfiguration, setNetworkConfiguration } = useNetworkConfiguration();

  return (
    <label className="cursor-pointer label">
      <span>Network</span> {/* 改用 <span> 代替 <a>，除非你需要它指向某个链接 */}
      <select             
        value={networkConfiguration}
        onChange={(e) => setNetworkConfiguration(e.target.value)} 
        className="select max-w-xs"
      >
        <option value="mainnet-beta">main</option>
        <option value="devnet">dev</option>
        <option value="testnet">test</option>
      </select>
    </label>
  );
};

export default NetworkSwitcher;
