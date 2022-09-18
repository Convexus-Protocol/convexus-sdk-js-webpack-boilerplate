import { Contract } from '@convexus/icon-toolkit';

export async function getPoolState (poolContract: Contract) {
  const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()]);

  return {
    liquidity,
    sqrtPriceX96: slot['sqrtPriceX96'],
    tick: parseInt(slot['tick'], 16),
    observationIndex: slot['observationIndex'],
    observationCardinality: slot['observationCardinality'],
    observationCardinalityNext: slot['observationCardinalityNext'],
    feeProtocol: slot['feeProtocol'],
    unlocked: slot['unlocked'],
  };
}
