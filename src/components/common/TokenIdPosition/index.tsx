import React from 'react';
import * as styles from './styles.module.less';
import {Rounding} from '@convexus/sdk-core';
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
    ).toFixed(3);

    const priceUpper = tickToPrice(
        position.pool.token0,
        position.pool.token1,
        position.tickUpper,
    ).toFixed(3);

    const {amount0, amount1} = {
        amount0: position.amount0,
        amount1: position.amount1,
    };

    return (
        <div className={styles.position}>
            <div className={styles.positionToken}>
                [{tokenId}] &nbsp;
                {position.pool.token0.symbol} / {position.pool.token1.symbol} (
                {position.pool.fee / 10000}%)
            </div>

            <div className={styles.positionPrice}>
                [{priceLower} ↔ {priceUpper}]
            </div>

            <div className={styles.positionAmounts}>
                {`
                    ${amount0.toSignificant(6, undefined, Rounding.ROUND_UP)} ${
                    position.pool.token0.symbol
                } 
                  + ${amount1.toSignificant(6, undefined, Rounding.ROUND_UP)} ${
                    position.pool.token1.symbol
                }`}
            </div>

            <div className={styles.positionRange}>
                {inRange ? <InRange /> : <OutOfRange />}
            </div>
        </div>
    );
}
