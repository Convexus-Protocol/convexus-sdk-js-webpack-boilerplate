import React, {useEffect, useRef, useState} from 'react';
import JSBI from 'jsbi';

import * as appStyles from '@components/app/app.module.less';
import * as styles from './styles.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {getPoolContract} from '@src/components/utils/contract/ConvexusPool/getContract';
import LiquidityChartRangeInput from './LiquidityChartRangeInput';
import {Pool, tickToPrice} from '@convexus/sdk';
import {getPoolFromAddress} from '@src/components/utils/contract/ConvexusPool/getPoolFromAddress';
import {Bound} from './LiquidityChartRangeInput/actions/Bound';
import {TickData} from './LiquidityChartRangeInput/hooks/computeSurroundingTicks';
import {tryParsePrice} from '@src/components/utils/parse/tryParsePrice';

const onLeftRangeInput = () => {
    console.log('left');
};

const onRightRangeInput = () => {
    console.log('right');
};

export function ModulePlotPoolLiquidity() {
    const poolRef = useRef<any>();
    const [pool, setPool] = useState<Pool>();
    const [ticksData, setTicksData] = useState<TickData[]>();

    const onPlotLiquidity = async () => {
        const poolAddress = poolRef.current.value;
        const pool = await getPoolFromAddress(poolAddress);
        setPool(pool);
    };

    useEffect(() => {
        if (!pool) return;
        if (!poolRef.current) return;

        fetchTicksData(pool).then((ticksData) => {
            setTicksData(ticksData);
        });
    }, [pool]);

    const fetchTicksData = async (pool: Pool) => {
        const poolAddress = poolRef.current.value;
        const poolContract = getPoolContract(poolAddress);

        // Get all ticksKeys indexes
        const ticksInitializedSize = parseInt(
            await poolContract.ticksInitializedSize(),
        );

        // Get all ticks keys
        const indexes = [...Array(ticksInitializedSize).keys()]; // range(ticksInitializedSize)

        // ticks need to be sorted
        const ticks = (
            await Promise.all(
                indexes.map((index) => poolContract.ticksInitialized(index)),
            )
        )
            .map((t) => parseInt(t))
            .sort((a, b) => a - b);

        // Get all ticks data
        const ticksData = (
            await Promise.all(
                ticks.map((ticksKey: any, index: number) => {
                    return poolContract
                        .ticks(ticksKey)
                        .then((tickData: any) => {
                            return {
                                tick: ticks[index],
                                ...tickData,
                            };
                        });
                }),
            )
        ).filter((a) => a.initialized == '0x1');

        const parseBigInt = (liquidityNet: string) => {
            if (liquidityNet.startsWith('-0x')) {
                return JSBI.unaryMinus(JSBI.BigInt(liquidityNet.substring(1)));
            } else {
                return JSBI.BigInt(liquidityNet);
            }
        };

        return ticksData.map((tickData) => {
            const tick = tickData.tick;
            const liquidityGross = parseBigInt(tickData.liquidityGross);
            const liquidityNet = parseBigInt(tickData.liquidityNet);
            const price = tickToPrice(pool.token0, pool.token1, tick);
            return {
                tick: tick,
                liquidityGross: liquidityGross,
                liquidityNet: liquidityNet,
                price0: price,
                price1: price.invert(),
            };
        });
    };

    return (
        <div className={appStyles.module} id="ModulePlotPoolLiquidity">
            <ModuleHeader
                text={'Plot pool liquidity'}
                name={'ModulePlotPoolLiquidity'}
            />

            <p>
                Pool address:
                <input
                    className={styles.inputAddress}
                    ref={poolRef}
                    type="text"
                    defaultValue={getAddressFromBookmark('WETH/CRV Pool')}
                />
            </p>

            <p>
                <button onClick={() => onPlotLiquidity()}>Plot</button>
            </p>

            {pool && ticksData && (
                <>
                    <p>Number of ticks={ticksData?.length ?? 0}</p>
                    <div className={styles.chart}>
                        <LiquidityChartRangeInput
                            pool={pool}
                            ticks={ticksData}
                            currencyA={pool.token0}
                            currencyB={pool.token1}
                            feeAmount={pool.fee}
                            ticksAtLimit={{
                                [Bound.LOWER]: false,
                                [Bound.UPPER]: false,
                            }}
                            price={parseFloat(pool.token0Price.toSignificant())}
                            priceLower={tryParsePrice(
                                pool.token0,
                                pool.token1,
                                (
                                    parseFloat(
                                        pool.token0Price.toSignificant(),
                                    ) / 1.2
                                ).toString(),
                            )}
                            priceUpper={tryParsePrice(
                                pool.token0,
                                pool.token1,
                                (
                                    parseFloat(
                                        pool.token0Price.toSignificant(),
                                    ) * 1.2
                                ).toString(),
                            )}
                            onLeftRangeInput={onLeftRangeInput}
                            onRightRangeInput={onRightRangeInput}
                            interactive={true}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
