import { connect, Contract, Account } from 'near-api-js';

export const contract = (
  accountId: Account,
  contractId: string,
  methodName: string
) => {
  new Contract(accountId, contractId, {
    viewMethods: [methodName],
    changeMethods: [methodName],
  });
};

export const result = async (params: any, methodName: string) => {
  // @ts-ignore
  return await contract[methodName]({ params }, GAS, 0);
};
