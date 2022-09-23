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

// Fetches all ticks for a given pool
function useAllTicks(
    pool: Pool,
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
    feeAmount: FeeAmount | undefined,
): {
    isLoading: boolean;
    error: unknown;
    ticks: readonly TickData[] | undefined;
} {
    const ticks = [
        {
            tick: '65280',
            liquidityNet: '12646966336838736458210',
            price0: '683.8055692681353',
            price1: '0.0014624040004094759',
        },
        {
            tick: '79140',
            liquidityNet: '-12646966336838736458210',
            price0: '2734.22777655114',
            price1: '0.00036573397746012416',
        },
    ];

    return {
        isLoading: false,
        error: null,
        ticks: ticks,
    };
}

export function usePoolActiveLiquidity(
    pool: Pool,
    currencyA: Currency | undefined,
    currencyB: Currency | undefined,
    feeAmount: FeeAmount | undefined,
    ticks: readonly TickData[] | undefined,
): {
    isLoading: boolean;
    error: any;
    activeTick: number | undefined;
    data: TickProcessed[] | undefined;
} {
    // Find nearest valid tick for pool in case tick is not initialized.
    const activeTick = useMemo(
        () => getActiveTick(pool.tickCurrent, feeAmount),
        [pool, feeAmount],
    );

    const isLoading = false;
    const error = null;
    // const { isLoading, error, ticks } = useAllTicks(pool, currencyA, currencyB, feeAmount)

    return useMemo(() => {
        if (
            !currencyA ||
            !currencyB ||
            activeTick === undefined ||
            !ticks ||
            ticks.length === 0 ||
            isLoading
        ) {
            return {
                isLoading: isLoading,
                error,
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
                isLoading,
                error,
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

        console.log('ticksProcessed=', ticksProcessed);

        return {
            isLoading,
            error,
            activeTick,
            data: ticksProcessed,
        };
    }, [currencyA, currencyB, activeTick, pool, ticks, isLoading, error]);
}
