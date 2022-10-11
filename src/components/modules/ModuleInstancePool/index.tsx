import React, {useRef, useState} from 'react';

import {Pool} from '@convexus/sdk';
import * as styles from './styles.module.less';
import * as appStyles from '@components/app/app.module.less';
import {getPoolFromAddress} from '@components/utils/contract/ConvexusPool/getPoolFromAddress';
import {PoolInfo} from './PoolInfo';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';

export function ModuleInstancePool() {
    const inputRef = useRef<any>();
    const [poolState, setPoolState] = useState<Pool>();

    const onReadPool = () => {
        const contractAddress = inputRef.current.value;
        getPoolFromAddress(contractAddress).then((pool) => {
            setPoolState(pool);
        });
    };

    return (
        <div className={appStyles.module} id="ModuleInstancePool">
            <ModuleHeader
                text={'Instanciate a new Pool object'}
                name={'ModuleInstancePool'}
            />
            <div>
                <input
                    ref={inputRef}
                    className={styles.poolContainerInput}
                    type="text"
                    defaultValue={getAddressFromBookmark('WETH/CRV Pool')}
                />
                &nbsp;
                <button onClick={() => onReadPool()}>Read Pool</button>
            </div>

            {poolState && <PoolInfo pool={poolState} />}
        </div>
    );
}
