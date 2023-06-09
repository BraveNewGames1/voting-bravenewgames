import { WalletSelector } from '@near-wallet-selector/core';
import axios from 'axios';
import { toast } from 'react-toastify';

export const DEFAULT_GAS = '40000000000000'; // 40 Tgas

export interface Status {
  value: string | number;
  growth: number;
}

export interface DaoStatus {
  daoId: string;
  timestamp: number;
  amount: Status;
  totalDaoFunds: Status;
  totalProposalCount: Status;
  activeProposalCount: Status;
  bountyCount: Status;
  nftCount: Status;
}

export interface Stats {
  timestamp: string;
  value: string;
}

const DAO = 'brave-new-games.sputnik-dao.near';
const BaseURL = 'https://api.app.astrodao.com/api/v1';

export const PAGE_LIMIT = 20;

export const fetchActiveProposals = async (dataLength: number) => {
  const resp = (
    await axios.get(
      `${BaseURL}/proposals?dao=${DAO}&active=true&limit=${PAGE_LIMIT}&offset=${dataLength}&orderBy=createdAt&order=DESC`
    )
  ).data;
  console.log(resp);
  return resp;
};

export const fetchApprovedProposals = async (dataLength: number) => {
  const resp = (
    await axios.get(
      `${BaseURL}/proposals?dao=${DAO}&status=Approved&limit=${PAGE_LIMIT}&offset=${dataLength}&orderBy=createdAt&order=DESC`
    )
  ).data;
  return resp;
};

export const fetchFailedProposals = async (dataLength: number) => {
  const resp = (
    await axios.get(
      `${BaseURL}/proposals?dao=${DAO}&failed=true&limit=${PAGE_LIMIT}&offset=${dataLength}&orderBy=createdAt&order=DESC`
    )
  ).data;
  return resp;
};

export const getCurrentUserVote = async (accountId: string) => {
  const resp = (
    await axios.get(
      `${BaseURL}/proposals?dao=${DAO}&accountId=${accountId}&voted=true`
    )
  ).data;
  return resp;
};

export const fetchDAOState = async (): Promise<DaoStatus> => {
  const resp = (await axios.get(`${BaseURL}/stats/dao/${DAO}/state`)).data;
  return resp;
};

export const fetchFundsStats = async (): Promise<Stats[]> => {
  const resp = (await axios.get(`${BaseURL}/stats/dao/${DAO}/funds`)).data;
  return resp;
};

export const fetchBountiesStats = async (): Promise<Stats[]> => {
  const resp = (await axios.get(`${BaseURL}/stats/dao/${DAO}/bounties`)).data;
  return resp;
};

export const fetchNFTStats = async (): Promise<Stats[]> => {
  const resp = (await axios.get(`${BaseURL}/stats/dao/${DAO}/nfts`)).data;
  return resp;
};

export const fetchProposalsStats = async (): Promise<Stats[]> => {
  const resp = (await axios.get(`${BaseURL}/stats/dao/${DAO}/proposals`)).data;
  return resp;
};

export const postVoteForProposal = async (
  selector: WalletSelector | null,
  contractId: string,
  proposalId: string,
  choice: string,
  accountId: string | null
) => {
  try {
    if (!selector || !selector.isSignedIn()) {
      toast.warn('Please connect to your account using wallet.');
      return;
    }
    const wallet = await selector.wallet();
    const resp = await wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: contractId,
          signerId: accountId as string,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'act_proposal',
                args: { id: proposalId, action: choice },
                gas: DEFAULT_GAS,
                deposit: '',
              },
            },
          ],
        },
      ],
    });
    return resp;
  } catch (error) {
    // @ts-ignore
    toast.error(error);
    console.error(error);
  }
};
