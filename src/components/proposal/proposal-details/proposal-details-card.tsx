import { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import cn from 'classnames';
import Button from '@/components/ui/button';
import RevealContent from '@/components/ui/reveal-content';
import AuctionCountdown from '@/components/nft/auction-countdown';
import { Switch } from '@/components/ui/switch';
import { ExportIcon } from '@/components/icons/export-icon';
import VotePoll from '@/components/proposal/proposal-details/vote-poll';
import VoterTable from '@/components/proposal/proposal-details/voter-table';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { useLayout } from '@/lib/hooks/use-layout';
import {
  LAYOUT_OPTIONS,
  MAINNET_TRANSACTION_URL,
  PROPOSAL_TYPE,
} from '@/lib/constants';
import moment from 'moment';
import { postVoteForProposal } from '@/lib/hooks/use-dao';
import { useNearContext } from '@/components/nft/NearContext';
import { WalletSelector } from '@near-wallet-selector/core';

interface VoteActionProps {
  proposalId: string;
  contractId: string;
  walletSelector: WalletSelector | null;
  accountId: string | null;
}

function VoteActionButton({
  proposalId,
  contractId,
  walletSelector,
  accountId,
}: VoteActionProps) {
  return (
    <div className="mt-4 flex items-center gap-3 xs:mt-6 xs:inline-flex md:mt-10">
      <Button
        shape="rounded"
        color="success"
        className="flex-1 xs:flex-auto"
        onClick={() =>
          postVoteForProposal(
            walletSelector,
            contractId,
            proposalId,
            'VoteApprove',
            accountId
          )
        }
      >
        Accept
      </Button>
      <Button
        onClick={() =>
          postVoteForProposal(
            walletSelector,
            contractId,
            proposalId,
            'VoteReject',
            accountId
          )
        }
        shape="rounded"
        color="danger"
        className="flex-1 xs:flex-auto"
      >
        Reject
      </Button>
    </div>
  );
}

export default function ProposalDetailsCard({
  proposal,
  status,
}: {
  proposal: any;
  status: string;
}) {
  const [isExpand, setIsExpand] = useState(false);
  const { layout } = useLayout();
  const [userVote, setUserVote] = useState<String | undefined>(undefined);
  const { accountId, selector } = useNearContext();

  useEffect(() => {
    // CHECK if user has already voted
    if (accountId && status === PROPOSAL_TYPE.ACTIVE) {
      const vote = Object.keys(proposal.votes).find((i) => i === accountId);
      setUserVote(vote ? proposal.votes[vote] : undefined);
    }
  }, []);

  function getVoteCounts(type: string) {
    let voteCount = 0;
    Object.values(proposal.votes).forEach((value) => {
      if (value === type) {
        voteCount++;
      }
    });
    return voteCount;
  }

  const voterListArray = Object.entries(proposal.votes).map(
    ([voterId, status]) => ({
      voterId,
      status,
    })
  );

  return (
    <motion.div
      layout
      initial={{ borderRadius: 8 }}
      className={cn(
        'mb-3 rounded-lg bg-white p-5 transition-shadow duration-200 dark:bg-light-dark xs:p-6 xl:p-4',
        isExpand ? 'shadow-large' : 'shadow-card hover:shadow-large'
      )}
    >
      <motion.div
        layout
        className={cn('flex w-full flex-col-reverse justify-between ', {
          'md:grid md:grid-cols-3': layout !== LAYOUT_OPTIONS.RETRO,
          'lg:grid lg:grid-cols-3': layout === LAYOUT_OPTIONS.RETRO,
        })}
      >
        <div className="self-start md:col-span-2">
          <h3
            onClick={() => setIsExpand(!isExpand)}
            className="cursor-pointer text-base font-medium leading-normal dark:text-gray-100 2xl:text-lg"
          >
            Proposal type: {proposal.type}
            {proposal.title}
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Proposal #{proposal.proposalId}
          </p>

          {/* show only when proposal is active */}
          {status === PROPOSAL_TYPE.ACTIVE && !userVote && (
            <>
              {!isExpand ? (
                <Button
                  onClick={() => setIsExpand(!isExpand)}
                  className="mt-4 w-full xs:mt-6 xs:w-auto md:mt-10"
                  shape="rounded"
                >
                  Vote Now
                </Button>
              ) : (
                <VoteActionButton
                  walletSelector={selector}
                  contractId={proposal.daoId}
                  proposalId={proposal.proposalId}
                  accountId={accountId}
                />
              )}
            </>
          )}

          {userVote && <p className="mt-4">Your Vote: {userVote}</p>}

          {/* show only for past vote */}
          {status !== PROPOSAL_TYPE.ACTIVE && (
            <>
              <time className="mt-4 block text-gray-400 xs:mt-6 md:mt-7">
                <span className="font-medium">Status: </span> {proposal.status}
              </time>
            </>
          )}
        </div>

        {/* vote countdown timer only for active & off-chain vote */}
        {status === PROPOSAL_TYPE.ACTIVE && (
          <div
            className={cn(
              "before:content-[' '] relative grid h-full gap-2 before:absolute before:bottom-0 before:border-b before:border-r before:border-dashed before:border-gray-200 ltr:before:left-0 rtl:before:right-0 dark:border-gray-700 dark:before:border-gray-700 xs:gap-2.5 ",
              {
                'mb-5 pb-5 before:h-[1px] before:w-full md:mb-0 md:pb-0 md:before:h-full md:before:w-[1px] ltr:md:pl-5 rtl:md:pr-5 ltr:xl:pl-3 rtl:xl:pr-3':
                  layout !== LAYOUT_OPTIONS.RETRO,
                'mb-5 pb-5 before:h-[1px] before:w-full ltr:pl-0 lg:mb-0 lg:pb-0 lg:before:h-full lg:before:w-[1px] ltr:lg:pl-3 rtl:lg:pr-3':
                  layout === LAYOUT_OPTIONS.RETRO,
              }
            )}
          >
            <h3 className="text-gray-400 md:text-base md:font-medium md:uppercase md:text-gray-900 dark:md:text-gray-100 2xl:text-lg ">
              Voting ends in
            </h3>
            <AuctionCountdown
              date={moment.unix(proposal.votePeriodEnd / 10 ** 9).toDate()}
            />
          </div>
        )}

        {/* switch toggle indicator for past vote */}
        {status !== PROPOSAL_TYPE.ACTIVE && (
          <div className="mb-4 flex items-center gap-3 md:mb-0 md:items-start md:justify-end">
            <Switch
              checked={isExpand}
              onChange={setIsExpand}
              className="flex items-center gap-3 text-gray-400"
            >
              <span className="inline-flex text-xs font-medium uppercase sm:text-sm">
                Close
              </span>
              <div
                className={cn(
                  isExpand
                    ? 'bg-brand dark:bg-white'
                    : 'bg-gray-200 dark:bg-gray-700',
                  'relative inline-flex h-[22px] w-10 items-center rounded-full transition-colors duration-300'
                )}
              >
                <span
                  className={cn(
                    isExpand
                      ? 'bg-white ltr:translate-x-5 rtl:-translate-x-5 dark:bg-gray-700'
                      : 'bg-white ltr:translate-x-0.5 rtl:-translate-x-0.5 dark:bg-gray-200',
                    'inline-block h-[18px] w-[18px] transform rounded-full bg-white transition-transform duration-200'
                  )}
                />
              </div>
              <span className="inline-flex text-xs font-medium uppercase sm:text-sm">
                View
              </span>
            </Switch>
          </div>
        )}
      </motion.div>
      <AnimatePresence>
        {isExpand && (
          <motion.div
            layout
            initial="exit"
            animate="enter"
            exit="exit"
            variants={fadeInBottom('easeIn', 0.25, 16)}
          >
            <div className="my-6 border-y border-dashed border-gray-200 py-6 text-gray-500 dark:border-gray-700 dark:text-gray-400">
              Proposed by:{' '}
              <a
                target="_blank"
                href={MAINNET_TRANSACTION_URL + proposal.transactionHash}
                className="ml-1 inline-flex items-center gap-3 font-medium text-gray-900 hover:underline hover:opacity-90 focus:underline focus:opacity-90 dark:text-gray-100"
              >
                {proposal.proposer} <ExportIcon className="h-auto w-3" />
              </a>
            </div>
            <VotePoll
              title={'Votes'}
              accepted={getVoteCounts('Approve')}
              rejected={getVoteCounts('Reject')}
              totalVotes={Object.values(proposal.votes).length}
            />
            <VoterTable votes={voterListArray} />
            <RevealContent defaultHeight={250}>
              <h4 className="mb-6 uppercase dark:text-gray-100">Description</h4>
              <div
                className="dynamic-html grid gap-2 leading-relaxed text-gray-600 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: proposal.description }}
              />
            </RevealContent>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
