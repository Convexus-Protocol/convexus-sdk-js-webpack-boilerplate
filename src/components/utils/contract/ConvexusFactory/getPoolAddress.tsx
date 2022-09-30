import { FeeAmount, PoolFactoryProvider } from '@convexus/sdk';
import { Token } from '@convexus/sdk-core';
import {factoryContract} from './getContract';

export async function getPoolAddress(
    tokenA: string,
    tokenB: string,
    fee: number,
) {
    return factoryContract.getPool(tokenA, tokenB, fee);
}

export class DefaultFactoryProvider implements PoolFactoryProvider {
    getPool (tokenA: Token, tokenB: Token, fee: FeeAmount): Promise<string> {
        return factoryContract.getPool(tokenA.address, tokenB.address, fee)
    }
}