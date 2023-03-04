import { WalletContext } from '@/lib/hooks/use-connect';
import { useContext } from 'react';
import ConnectBtn from "./ConnectBtn";
import { NearProvider } from './NearContext';


export default function WalletConnect() {
  const { address, disconnectWallet, balance } = useContext(WalletContext);


  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.


  return (
    <>
      {address ? (
        <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
          <div className="relative flex-shrink-0"></div>
        </div>
      ) : (
        <NearProvider>
             <ConnectBtn /> 
        </NearProvider>
     
      )}
    </>
  );
}
