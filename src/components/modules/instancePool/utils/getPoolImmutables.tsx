import { Contract } from '@convexus/icon-toolkit';

export async function getPoolImmutables (poolContract: Contract) {
  const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
    poolContract.factory(),
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
    poolContract.tickSpacing(),
    poolContract.maxLiquidityPerTick(),
  ]);

  const immutables = {
    factory,
    token0,
    token1,
    fee: parseInt(fee, 16),
    tickSpacing,
    maxLiquidityPerTick,
  };

  return immutables;
}
