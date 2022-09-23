import React, {useRef} from 'react';

import * as appStyles from '@components/app/app.module.less';
import * as styles from './styles.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {getPoolContract} from '@src/components/utils/contract/ConvexusPool/getContract';

export function ModulePlotPoolLiquidity() {
    const poolRef = useRef<any>();

    const onPlotLiquidity = async () => {
        const poolAddress = poolRef.current.value;
        const poolContract = getPoolContract(poolAddress);

        // Get all ticksKeys indexes
        const ticksKeysSize = parseInt(await poolContract.ticksKeysSize());

        // Get all ticks keys
        const indexes = [...Array(ticksKeysSize).keys()]; // range(ticksKeysSize)
        const ticksKeys = await Promise.all(
            indexes.map((index) => poolContract.ticksKeys(index)),
        );

        // Get all ticks
        const ticks = await Promise.all(
            ticksKeys.map((ticksKey) => poolContract.ticks(ticksKey)),
        );

        console.log(ticks);
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
        </div>
    );
}
