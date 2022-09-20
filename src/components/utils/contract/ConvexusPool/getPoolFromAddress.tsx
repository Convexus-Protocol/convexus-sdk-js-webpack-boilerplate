import {Contract} from '@convexus/icon-toolkit';
import {Token} from '@convexus/sdk-core';
import {Pool} from '@convexus/sdk';
import IConvexusPool from '@src/artifacts/contracts/ConvexusPool/ConvexusPool.json';
import {getPoolImmutables} from './getPoolImmutables';
import {getPoolState} from './getPoolState';
import {
    iconService,
    debugService,
    networkId,
} from '@src/components/utils/contract/getProviders';
import {getTokenFromAddress} from '@src/components/utils/contract/Token/getTokenFromAddress';

export async function getPoolFromAddress(poolAddress: string): Promise<Pool> {
    const poolContract = new Contract(
        poolAddress,
        IConvexusPool,
        iconService,
        debugService,
        networkId,
    );
    const [poolImmutables, poolState] = await Promise.all([
        getPoolImmutables(poolContract),
        getPoolState(poolContract),
    ]);

    const token0: Token = await getTokenFromAddress(poolImmutables.token0);
    const token1: Token = await getTokenFromAddress(poolImmutables.token1);

    return new Pool(
        token0,
        token1,
        poolImmutables.fee,
        poolState.sqrtPriceX96.toString(),
        poolState.liquidity.toString(),
        poolState.tick,
    );
}
