import {Pool} from '@convexus/sdk';
import React from 'react';
import * as styles from './ModuleInstancePool.module.less';

interface PoolInfoInterface {
    pool: Pool;
}

export function PoolInfo({pool}: PoolInfoInterface) {
    return (
        <div className={styles.poolInfo}>
            <p>
                Token0: <span>{pool.token0.symbol}</span>
            </p>
            <p>
                Token1: <span>{pool.token1.symbol}</span>
            </p>
            <p>
                Fee: <span>{pool.fee}</span>
            </p>
            <p>
                Price: <span>{pool.token0Price.toFixed(2)}</span>
            </p>
            <p>
                Liquidity: <span>{pool.liquidity.toString()}</span>
            </p>
            <p>
                Tick current: <span>{pool.tickCurrent}</span>
            </p>
        </div>
    );
}
