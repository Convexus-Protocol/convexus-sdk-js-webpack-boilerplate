import React, {useRef, useState} from 'react';

import {Pool} from '@convexus/sdk';
import * as styles from './styles.module.less';
import * as appStyles from '@components/app/app.module.less';
import {getPoolFromAddress} from '@components/utils/contract/ConvexusPool/getPoolFromAddress';
import {PoolInfo} from './PoolInfo';
import {ModuleHeader} from '../ModuleHeader';

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
            <div className={styles.poolContainer}>
                <input
                    ref={inputRef}
                    className={styles.poolContainerInput}
                    type="text"
                    defaultValue="cxe5d72412eb7a37a0ad72216089c177c92488b760"
                />

                <button onClick={() => onReadPool()}>Read Pool</button>
            </div>

            {poolState && <PoolInfo pool={poolState} />}
        </div>
    );
}
