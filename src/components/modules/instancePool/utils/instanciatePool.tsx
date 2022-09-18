import { Contract } from '@convexus/icon-toolkit';
import { Token } from '@convexus/sdk-core';
import { Pool } from '@convexus/sdk';
import IConvexusPool from '@src/artifacts/contracts/ConvexusPool/ConvexusPool.json';
import { getPoolImmutables } from './getPoolImmutables';
import { getPoolState } from './getPoolState';
import { getTokenInfo } from '@components/utils/getTokenInfo';
import IIRC2 from '@src/artifacts/contracts/IRC2/IRC2.json';
import { iconService, debugService, networkId } from '@components/utils/getProviders'

export async function instanciatePool (poolAddress: string): Promise<Pool> {

  const poolContract = new Contract(poolAddress, IConvexusPool, iconService, debugService, networkId);
  const [poolImmutables, poolState] = await Promise.all([getPoolImmutables(poolContract), getPoolState(poolContract)]);
  
  const token0Contract = new Contract(poolImmutables.token0, IIRC2, iconService, debugService, networkId)
  const token1Contract = new Contract(poolImmutables.token1, IIRC2, iconService, debugService, networkId)
  const [token0Info, token1Info] = await Promise.all([getTokenInfo(token0Contract), getTokenInfo(token1Contract)]);

  const token0 = new Token(token0Info.address, token0Info.decimals, token0Info.symbol, token0Info.name);
  const token1 = new Token(token1Info.address, token1Info.decimals, token1Info.symbol, token1Info.name);

  return new Pool (
    token0,
    token1,
    poolImmutables.fee,
    poolState.sqrtPriceX96.toString(),
    poolState.liquidity.toString(),
    poolState.tick
  );
}
