import {Currency} from '@convexus/sdk-core';
import {FeeAmount, Pool, tickToPrice, TICK_SPACINGS} from '@convexus/sdk';
import JSBI from 'jsbi';
import {useMemo} from 'react';
import computeSurroundingTicks, {TickData} from './computeSurroundingTicks';

// Tick with fields parsed to JSBIs, and active liquidity computed.
export interface TickProcessed {
    tick: number;
    liquidityActive: JSBI;
    liquidityNet: JSBI;
    price0: string;
}

const PRICE_FIXED_DIGITS = 8;

const getActiveTick = (
    tickCurrent: number | undefined,
    feeAmount: FeeAmount | undefined,
) =>
    tickCurrent && feeAmount
        ? Math.floor(tickCurrent / TICK_SPACINGS[feeAmount]) *
          TICK_SPACINGS[feeAmount]
        : undefined;

export function usePoolActiveLiquidity(
    pool: Pool,
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
    feeAmount: FeeAmount | undefined,
    ticks: readonly TickData[] | undefined,
): {
    activeTick: number | undefined;
    data: TickProcessed[] | undefined;
} {
    // Find nearest valid tick for pool in case tick is not initialized.
    const activeTick = useMemo(
        () => getActiveTick(pool.tickCurrent, feeAmount),
        [pool, feeAmount],
    );

    return useMemo(() => {
        if (
            !currencyA ||
            !currencyB ||
            activeTick === undefined ||
            !ticks ||
            ticks.length === 0
        ) {
            return {
                activeTick,
                data: undefined,
            };
        }

        const token0 = currencyA?.wrapped;
        const token1 = currencyB?.wrapped;

        // find where the active tick would be to partition the array
        // if the active tick is initialized, the pivot will be an element
        // if not, take the previous tick as pivot
        const pivot = ticks.findIndex(({tick}) => tick > activeTick) - 1;

        if (pivot < 0) {
            // consider setting a local error
            console.error('TickData pivot not found');
            return {
                activeTick,
                data: undefined,
            };
        }

        const activeTickProcessed: TickProcessed = {
            liquidityActive: JSBI.BigInt(pool.liquidity ?? 0),
            tick: activeTick,
            liquidityNet:
                Number(ticks[pivot].tick) === activeTick
                    ? JSBI.BigInt(ticks[pivot].liquidityNet)
                    : JSBI.BigInt(0),
            price0: tickToPrice(token0, token1, activeTick).toFixed(
                PRICE_FIXED_DIGITS,
            ),
        };

        const subsequentTicks = computeSurroundingTicks(
            token0,
            token1,
            activeTickProcessed,
            ticks,
            pivot,
            true,
        );

        const previousTicks = computeSurroundingTicks(
            token0,
            token1,
            activeTickProcessed,
            ticks,
            pivot,
            false,
        );

        const ticksProcessed = previousTicks
            .concat(activeTickProcessed)
            .concat(subsequentTicks);

        return {
            activeTick,
            data: ticksProcessed,
        };
    }, [currencyA, currencyB, activeTick, pool, ticks]);
}
