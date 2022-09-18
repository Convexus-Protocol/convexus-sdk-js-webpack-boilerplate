import { Contract } from '@convexus/icon-toolkit';

export async function getTokenInfo (contract: Contract) {

  const result = await Promise.all([
    contract.decimals(),
    contract.symbol(),
    contract.name()
  ]);

  return {
    address: contract.address,
    decimals: parseInt(result[0]),
    symbol: result[1],
    name: result[2]
  };
}
