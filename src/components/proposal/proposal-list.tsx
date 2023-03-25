import { motion, LayoutGroup } from 'framer-motion';
import ProposalDetailsCard from '@/components/proposal/proposal-details/proposal-details-card';
import { ExportIcon } from '@/components/icons/export-icon';
import {
  fetchActiveProposals,
  fetchPastProposals,
  PAGE_LIMIT,
} from '@/lib/hooks/use-dao';
import { useEffect, useState } from 'react';
import { PROPOSAL_TYPE } from '@/lib/constants';
import Loader from '../ui/loader';
import { LongArrowLeft } from '../icons/long-arrow-left';
import { LongArrowRight } from '../icons/long-arrow-right';
import Button from '@/components/ui/button';

export default function ProposalList({ voteStatus }: { voteStatus: string }) {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    const offset = PAGE_LIMIT * currentPageIndex;
    if (voteStatus === PROPOSAL_TYPE.ACTIVE) {
      fetchActiveProposals(offset).then((resp) => {
        setProposals(resp?.data);
        setTotalCount(resp.total);
        setLoading(false);
      });
    } else if (voteStatus === PROPOSAL_TYPE.PAST) {
      fetchPastProposals(offset).then((resp) => {
        setProposals(resp?.data);
        setTotalCount(resp.total);
        setLoading(false);
      });
    }
  }, [currentPageIndex, voteStatus]);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  const noOfPages = Math.ceil(totalCount / PAGE_LIMIT);

  return (
    <LayoutGroup>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <motion.div
          layout
          initial={{ borderRadius: 16 }}
          className="rounded-2xl"
        >
          {proposals?.length > 0 ? (
            <>
              {proposals.map((proposal: any) => (
                <ProposalDetailsCard status={voteStatus} proposal={proposal} />
              ))}
              <div className="flex w-full items-center justify-center text-sm xs:justify-end sm:mt-3">
                <div className="flex items-center gap-4">
                  <Button
                    size="mini"
                    shape="rounded"
                    variant="transparent"
                    disabled={currentPageIndex === 0}
                    onClick={() => {
                      setCurrentPageIndex((prev) => prev - 1);
                      scrollToTop();
                    }}
                  >
                    <LongArrowLeft
                      color="white"
                      className="h-auto w-4 rtl:rotate-180"
                    />
                  </Button>
                  <div className="uppercase dark:text-gray-100">
                    Page {currentPageIndex + 1}{' '}
                    <span className="text-gray-500 dark:text-gray-400">
                      of {noOfPages}
                    </span>
                  </div>
                  <Button
                    size="mini"
                    shape="rounded"
                    variant="transparent"
                    onClick={() => {
                      setCurrentPageIndex((prev) => prev + 1);
                      scrollToTop();
                    }}
                    disabled={
                      currentPageIndex + 1 ===
                      Math.ceil(totalCount / PAGE_LIMIT)
                    }
                  >
                    <LongArrowRight
                      color="white"
                      className="h-auto w-4 rtl:rotate-180"
                    />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg bg-white px-4 py-16 text-center shadow-card dark:bg-light-dark xs:px-6 md:px-5 md:py-24">
              <div className="mb-6 flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white shadow-card md:h-24 md:w-24">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-auto w-8 md:w-10"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    d="M1,13 L6,2 L18,2 L23,13 L23,22 L1,22 L1,13 Z M1,13 L8,13 L8,16 L16,16 L16,13 L23,13"
                  />
                </svg>
              </div>
              <h2 className="mb-3 text-base font-medium leading-relaxed dark:text-gray-100 md:text-lg xl:text-xl">
                There are no proposals at the moment
              </h2>
              <p className="leading-relaxed text-gray-600 dark:text-gray-400">
                Discuss ideas you have on{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://discord.com/"
                  className="inline-flex items-center gap-1 text-gray-900 underline transition-opacity duration-200 hover:no-underline hover:opacity-90 dark:text-gray-100"
                >
                  Discord <ExportIcon className="h-auto w-3" />
                </a>{' '}
                or{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.discourse.org/"
                  className="inline-flex items-center gap-1 text-gray-900 underline transition-opacity duration-200 hover:no-underline hover:opacity-90 dark:text-gray-100"
                >
                  Discourse <ExportIcon className="h-auto w-3" />
                </a>
              </p>
            </div>
          )}
        </motion.div>
      )}
    </LayoutGroup>
  );
}
