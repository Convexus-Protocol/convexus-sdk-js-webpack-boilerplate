import {Currency} from '@convexus/sdk-core';
import {FeeAmount, Pool} from '@convexus/sdk';
import {TickProcessed, usePoolActiveLiquidity} from './hooks/usePoolTickData';
import {useCallback, useMemo} from 'react';

import {ChartEntry} from './types';
import {TickData} from './hooks/computeSurroundingTicks';

export function useDensityChartData({
    pool,
    currencyA,
    currencyB,
    feeAmount,
    ticks,
}: {
    pool: Pool;
    currencyA: Currency | undefined;
    currencyB: Currency | undefined;
    feeAmount: FeeAmount | undefined;
    ticks: readonly TickData[] | undefined;
}) {
    const {data} = usePoolActiveLiquidity(
        pool,
        currencyA,
        currencyB,
        feeAmount,
        ticks,
    );

    const formatData = useCallback(() => {
        if (!data?.length) {
            return undefined;
        }

        const newData: ChartEntry[] = [];

        for (let i = 0; i < data.length; i++) {
            const t: TickProcessed = data[i];

            const chartEntry = {
                activeLiquidity: parseFloat(t.liquidityActive.toString()),
                price0: parseFloat(t.price0),
            };

            if (chartEntry.activeLiquidity > 0) {
                newData.push(chartEntry);
            }
        }

        return newData;
    }, [data]);

    return useMemo(() => {
        return {
            formattedData: formatData(),
        };
    }, [formatData]);
}
