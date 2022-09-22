import {Pool} from '@convexus/sdk';
import {tryParseTick} from './tryParseTick';

export function tryParsePriceToTick(pool: Pool, boundPrice: string): number {
    if (!pool) return 0;

    return tryParseTick(pool.token0, pool.token1, pool.fee, boundPrice);
}
