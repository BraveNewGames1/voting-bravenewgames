import type { NextPageWithLayout } from '@/types';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import cn from 'classnames';
import routes from '@/config/routes';
import Button from '@/components/ui/button';
import Image from '@/components/ui/image';
import ParamTab, { TabPanel } from '@/components/ui/param-tab';
import ProposalList from '@/components/proposal/proposal-list';
import { ExportIcon } from '@/components/icons/export-icon';
// static data
import { getVotesByStatus } from '@/data/static/vote-data';
import votePool from '@/assets/images/vote-pool.svg';
import RootLayout from '@/layouts/_root-layout';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS, PROPOSAL_TYPE } from '@/lib/constants';
import Info from '@/components/proposal/info';

const ProposalsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { layout } = useLayout();
  function goToCreateProposalPage() {
    setTimeout(() => {
      router.push(routes.createProposal);
    }, 800);
  }
  const tabMenuItems = [
    {
      title: 'Info',
      path: 'info',
    },
    {
      title: 'Active',
      path: PROPOSAL_TYPE.ACTIVE,
    },
    {
      title: 'Approved',
      path: PROPOSAL_TYPE.APPROVED,
    },
    {
      title: 'Failed',
      path: PROPOSAL_TYPE.FAILED,
    },
  ];
  return (
    <>
      <NextSeo
        title="Proposal"
        description="Criptic - React Next Web3 NFT Crypto Dashboard Template"
      />
      <section className="mx-auto w-full max-w-[1160px] text-sm ">
        <header
          className={cn(
            'mb-8 flex flex-col gap-4 rounded-lg bg-white p-5 py-6 shadow-card dark:bg-light-dark xs:p-6 ',
            {
              'sm:flex-row sm:items-center sm:justify-between':
                layout !== LAYOUT_OPTIONS.RETRO,
              'lg:flex-row lg:items-center lg:justify-between':
                layout === LAYOUT_OPTIONS.RETRO,
            }
          )}
        >
          <div className="flex items-start gap-4 xs:items-center xs:gap-3 xl:gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-dark">
              <Image alt="Vote Pool" src={votePool} width={32} height={32} />
            </div>
            <div>
              <h2 className="mb-2 text-base font-medium uppercase dark:text-gray-100 xl:text-lg">
                Brave New Games
              </h2>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                You can check out all the information on Brave New Games
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Button shape="rounded" fullWidth={true} className="uppercase">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://app.astrodao.com/dao/brave-new-games.sputnik-dao.near/proposals"
              >
                Create Proposal
              </a>
            </Button>
          </div>
        </header>
        <ParamTab tabMenu={tabMenuItems}>
          <TabPanel className="focus:outline-none">
            <Info />
          </TabPanel>
          <TabPanel className="focus:outline-none">
            <ProposalList voteStatus={PROPOSAL_TYPE.ACTIVE} />
          </TabPanel>
          <TabPanel className="focus:outline-none">
            <ProposalList voteStatus={PROPOSAL_TYPE.APPROVED} />
          </TabPanel>
          <TabPanel className="focus:outline-none">
            <ProposalList voteStatus={PROPOSAL_TYPE.FAILED} />
          </TabPanel>
        </ParamTab>
      </section>
    </>
  );
};

ProposalsPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default ProposalsPage;
