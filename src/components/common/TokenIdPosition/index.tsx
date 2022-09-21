import React from 'react';
import * as styles from './styles.module.less';
import {OutOfRange} from '@src/components/common/OutOfRange';
import {InRange} from '@src/components/common/InRange';
import {Position, tickToPrice} from '@convexus/sdk';

interface TokenIdPositionProps {
    tokenId: number;
    position: Position;
}

export function TokenIdPosition({tokenId, position}: TokenIdPositionProps) {
    const inRange =
        position.pool.tickCurrent >= position.tickLower &&
        position.pool.tickCurrent <= position.tickUpper;

    const priceLower = tickToPrice(
        position.pool.token0,
        position.pool.token1,
        position.tickLower,
    ).toSignificant();

    const priceUpper = tickToPrice(
        position.pool.token0,
        position.pool.token1,
        position.tickUpper,
    ).toSignificant();

    return (
        <div className={styles.position}>
            <div className={styles.positionToken}>
                [{tokenId}] &nbsp;
                {position.pool.token0.symbol} / {position.pool.token1.symbol} (
                {position.pool.fee / 10000}%)
            </div>

            <div className={styles.positionPrice}>
                Min: {priceLower} - Max: {priceUpper}
            </div>

            <div className={styles.positionAmounts}>
                {position.amount0.toSignificant()} {position.pool.token0.symbol}{' '}
                - {position.amount1.toSignificant()}{' '}
                {position.pool.token1.symbol}
            </div>

            <div className={styles.positionRange}>
                {inRange ? <InRange /> : <OutOfRange />}
            </div>
        </div>
    );
}
