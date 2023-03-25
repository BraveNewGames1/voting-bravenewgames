import { NETWORK_ID } from '@/components/nft/NearContext';
import {
  NetworkId,
  setupWalletSelector,
  WalletSelector,
} from '@near-wallet-selector/core';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupSender } from '@near-wallet-selector/sender';

const WalletUrl = 'https://wallet.near.org';
const Network = 'mainnet';

export const setupNearWalletCustom = () => {
  return async (options: any) => {
    const wallet = await setupMyNearWallet({
      walletUrl: WalletUrl, // get walletUrl from config
      iconUrl: './assets/near-wallet-iconx.png',
    })(options);

    if (!wallet) {
      return null;
    }

    return {
      ...wallet,
      id: 'near-wallet',
      metadata: {
        ...wallet.metadata,
        name: 'NEAR Wallet',
        description: null,
        iconUrl: './assets/near-wallet-icon.png',
        deprecated: false,
        available: true,
      },
    };
  };
};

export async function setupSelector(): Promise<WalletSelector> {
  return setupWalletSelector({
    network: Network || 'testnet',
    modules: [setupNearWalletCustom(), setupSender(), setupMyNearWallet()],
  });
}
