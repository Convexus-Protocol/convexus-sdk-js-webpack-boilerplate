import {Pool} from '@convexus/sdk';
import React from 'react';
import * as styles from './styles.module.less';

interface PoolInfoInterface {
    pool: Pool;
}

export function PoolInfo({pool}: PoolInfoInterface) {
    return (
        <div className={styles.poolInfo}>
            <p>
                <b>Token0</b>: <span>{pool.token0.symbol}</span>
            </p>
            <p>
                <b>Token1:</b> <span>{pool.token1.symbol}</span>
            </p>
            <p>
                <b>Fee: </b>
                <span>
                    {pool.fee} ({pool.fee / 10000}%)
                </span>
            </p>
            <p>
                <b>Price:</b> 1 {pool.token0.symbol} =
                {pool.token0Price.toSignificant()}
                {pool.token1.symbol} (sqrtPrice= {pool.sqrtRatioX96.toString()})
            </p>
            <p>
                <b>Liquidity:</b> <span>{pool.liquidity.toString()}</span>
            </p>
            <p>
                <b>Tick current</b>: <span>{pool.tickCurrent}</span>
            </p>
        </div>
    );
}
