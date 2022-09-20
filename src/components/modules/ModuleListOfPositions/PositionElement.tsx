import React from 'react';
import * as styles from './styles.module.less';
import {OutOfRange} from './OutOfRange';
import {InRange} from './InRange';

export function PositionElement({position}: any) {
    const inRange =
        position.pool.tickCurrent >= position.tickLower &&
        position.pool.tickCurrent <= position.tickUpper;
    return (
        <div className={styles.position}>
            <div className={styles.positionToken}>
                [{position.tokenId}] &nbsp;
                {position.pool.token0.symbol} / {position.pool.token1.symbol} (
                {position.pool.fee / 10000}%)
            </div>

            <div className={styles.positionPrice}>
                Min: {position.priceLower} - Max: {position.priceUpper}
            </div>

            <div className={styles.positionRange}>
                {inRange ? <InRange /> : <OutOfRange />}
            </div>
        </div>
    );
}
