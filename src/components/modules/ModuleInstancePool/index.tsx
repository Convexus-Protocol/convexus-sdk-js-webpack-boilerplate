import React, {useRef, useState} from 'react';

import {Pool} from '@convexus/sdk';
import * as styles from './styles.module.less';
import * as appStyles from '@components/app/app.module.less';
import {instanciatePool} from './utils/instanciatePool';
import {PoolInfo} from './PoolInfo';
import {ModuleHeader} from '../ModuleHeader';

export function ModuleInstancePool() {
    const inputRef = useRef<any>();
    const [poolState, setPoolState] = useState<Pool>();

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
                    defaultValue="cx4f5661a3dfaafbc11d13d3ea80474870b37369ca"
                />

                <button
                    onClick={() => {
                        const contractAddress = inputRef.current.value;
                        instanciatePool(contractAddress).then((pool) => {
                            setPoolState(pool);
                        });
                    }}
                >
                    Read Pool
                </button>
            </div>

            {poolState && <PoolInfo pool={poolState} />}
        </div>
    );
}
