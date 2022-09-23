import React, {useRef, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import * as styles from './styles.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {getPoolContract} from '@src/components/utils/contract/ConvexusPool/getContract';
import LiquidityChartRangeInput from './LiquidityChartRangeInput';
import {Pool} from '@convexus/sdk';
import {getPoolFromAddress} from '@src/components/utils/contract/ConvexusPool/getPoolFromAddress';
import {Bound} from './LiquidityChartRangeInput/actions/Bound';

const onLeftRangeInput = () => {};

const onRightRangeInput = () => {};

export function ModulePlotPoolLiquidity() {
    const poolRef = useRef<any>();
    const [pool, setPool] = useState<Pool>();
    const hasExistingPosition = false;

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

    const onPlotLiquidity = async () => {
        const poolAddress = poolRef.current.value;
        const pool = await getPoolFromAddress(poolAddress);
        setPool(pool);

        // const poolContract = getPoolContract(poolAddress);

        // // Get all ticksKeys indexes
        // const ticksKeysSize = parseInt(await poolContract.ticksKeysSize());

        // // Get all ticks keys
        // const indexes = [...Array(ticksKeysSize).keys()]; // range(ticksKeysSize)
        // const ticksKeys = await Promise.all(
        //     indexes.map((index) => poolContract.ticksKeys(index)),
        // );

        // // Get all ticks
        // const ticks = await Promise.all(
        //     ticksKeys.map((ticksKey) => poolContract.ticks(ticksKey)),
        // );

        // console.log(ticks);
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

            {pool && (
                <LiquidityChartRangeInput
                    pool={pool}
                    ticks={ticks}
                    currencyA={pool.token0}
                    currencyB={pool.token1}
                    feeAmount={pool.fee}
                    ticksAtLimit={{
                        [Bound.LOWER]: false,
                        [Bound.UPPER]: false,
                    }}
                    price={parseFloat(pool.token0Price.toSignificant())}
                    priceLower={pool.token0Price}
                    priceUpper={pool.token0Price}
                    onLeftRangeInput={onLeftRangeInput}
                    onRightRangeInput={onRightRangeInput}
                    interactive={!hasExistingPosition}
                />
            )}
        </div>
    );
}
