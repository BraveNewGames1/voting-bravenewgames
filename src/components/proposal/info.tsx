import { useEffect, useState } from 'react';
import {
  DaoStatus,
  fetchBountiesStats,
  fetchDAOState,
  fetchNFTStats,
  fetchProposalsStats,
  Status,
  Stats,
  fetchFundsStats,
} from '@/lib/hooks/use-dao';
import Loader from '../ui/loader';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Copy } from '@/components/icons/copy';
import { useCopyToClipboard } from 'react-use';
import { Check } from '../icons/check';
import { ArrowUp } from '../icons/arrow-up';
import { ArrowDown } from '../icons/arrow-down';
import moment from 'moment';

const BlockTitle = {
  DAO_FUNDS: 'DAO funds',
  BOUNTIES: 'Bounties',
  NFTs: 'NFTs',
  ACTIVE_PROPOSALS: 'Active Proposals',
  TOTAL_PROPOSALS: 'Total Proposals',
};

export default function Info() {
  const [daoData, setDaoData] = useState<DaoStatus | null>(null);
  const [selectedData, setSelected] = useState<any>(null);
  const [funds, setFunds] = useState<Stats[] | null>(null);
  const [bounties, setBounties] = useState<Stats[] | null>(null);
  const [nfts, setNFTS] = useState<Stats[] | null>(null);
  const [proposals, setProposals] = useState<Stats[] | null>(null);

  let [copyButtonStatus, setCopyButtonStatus] = useState('Copy');

  let [_, copyToClipboard] = useCopyToClipboard();

  const handleCopyToClipboard = () => {
    copyToClipboard(daoData?.['daoId'] ?? '');
    setCopyButtonStatus('Copied!');
    setTimeout(() => {
      setCopyButtonStatus(copyButtonStatus);
    }, 1000);
  };

  useEffect(() => {
    fetchDAOState().then((resp) => {
      setDaoData(resp);
      setSelected(BlockTitle.DAO_FUNDS);
    });
    fetchFundsStats().then((resp) => {
      setFunds(resp);
    });
    fetchBountiesStats().then((resp) => {
      setBounties(resp);
    });
    fetchNFTStats().then((resp) => {
      setNFTS(resp);
    });
    fetchProposalsStats().then((resp) => {
      setProposals(resp);
    });
  }, []);

  const Block = ({ title, data }: { title: string; data: Status }) => {
    const growth = data['growth'];
    return (
      <div
        onClick={() => setSelected(title)}
        className={`info-card mb-6 cursor-pointer rounded-lg bg-white shadow-card dark:bg-light-dark 
          ${selectedData === title ? 'info-card-selected' : ''}
        `}
      >
        <div className="px-6 py-4">
          <div className="flex justify-between">
            <div className="text-l mb-2 w-3/4 font-bold">{title}</div>
            <div
              className="flex items-center"
              style={{ color: +growth < 0 ? 'red' : '#16FF00' }}
            >
              {+growth < 0 ? (
                <ArrowDown color="red" />
              ) : +growth === 0 ? (
                <> </>
              ) : (
                <ArrowUp color="#16FF00" />
              )}
              {growth}%
            </div>
          </div>
          <div className="text-md mb-2">
            {data['value']}
            {title === BlockTitle.DAO_FUNDS && ' USD'}{' '}
          </div>
        </div>
      </div>
    );
  };

  const getDate = (timestamp: number) => moment(timestamp).format('LL');

  const parseTimeStampAndValue = (array: Array<any> | null) =>
    array?.map((item: any) => {
      return {
        timestamp: getDate(item.timestamp),
        value: item.value,
      };
    }) ?? [];

  function getChartData() {
    switch (selectedData) {
      case BlockTitle.BOUNTIES:
        return parseTimeStampAndValue(bounties);
      case BlockTitle.NFTs:
        return parseTimeStampAndValue(nfts);
      case BlockTitle.TOTAL_PROPOSALS:
        return (
          proposals?.map((item: any) => {
            return {
              timestamp: getDate(item.timestamp),
              value: item.total,
            };
          }) ?? []
        );
      case BlockTitle.ACTIVE_PROPOSALS:
        return (
          proposals?.map((item: any) => {
            return {
              timestamp: getDate(item.timestamp),
              value: item.active,
            };
          }) ?? []
        );
      default:
        return parseTimeStampAndValue(funds);
    }
  }

  return (
    <>
      {!daoData ? (
        <div className="flex flex-1  items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <h2 className="mb-1 font-bold uppercase dark:text-gray-100">
            Brave New Games
          </h2>
          <p
            onClick={handleCopyToClipboard}
            className="mb-6 flex cursor-pointer gap-2 dark:text-gray-100"
          >
            {daoData['daoId']}
            {copyButtonStatus ? (
              <Check className="h-auto w-3.5 text-green-500" />
            ) : (
              <Copy className="h-auto w-3.5" />
            )}
          </p>
          <div className="mb-4 grid gap-10 sm:grid-cols-1 md:grid-cols-2">
            <div className="rounded-lg bg-white p-3 shadow-card dark:bg-light-dark">
              <h5 className="mb-1 dark:text-gray-100">{selectedData}</h5>
              <ResponsiveContainer width={'100%'} height={480}>
                <AreaChart
                  data={getChartData()}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" type="category" />
                  <YAxis dataKey="value" type="number" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div>
              <Block
                title={BlockTitle.DAO_FUNDS}
                data={daoData['totalDaoFunds']}
              />
              <Block
                title={BlockTitle.BOUNTIES}
                data={daoData['bountyCount']}
              />
              <Block title={BlockTitle.NFTs} data={daoData['nftCount']} />
              <Block
                title={BlockTitle.ACTIVE_PROPOSALS}
                data={daoData['activeProposalCount']}
              />
              <Block
                title={BlockTitle.TOTAL_PROPOSALS}
                data={daoData['totalProposalCount']}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
