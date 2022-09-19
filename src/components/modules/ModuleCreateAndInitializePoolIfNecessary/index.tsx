import React, {useRef, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import * as styles from './styles.module.less';
import {createAndInitializePoolIfNecessary} from './createAndInitializePoolIfNecessary';
import {ModuleHeader} from '../ModuleHeader';

export function ModuleCreateAndInitializePoolIfNecessary() {
    const tokenARef = useRef<any>();
    const tokenBRef = useRef<any>();
    const feeRef = useRef<any>();
    const [txHashResult, setTxHashResult] = useState<string>();

    return (
        <div
            className={appStyles.module}
            id="ModuleCreateAndInitializePoolIfNecessary"
        >
            <ModuleHeader
                text={'Create a new pool'}
                name={'ModuleCreateAndInitializePoolIfNecessary'}
            />

            <p>
                Token A address:{' '}
                <input
                    className={styles.inputAddress}
                    ref={tokenARef}
                    type="text"
                    defaultValue="cx26a0bf7574f0c7eff197beaed51736954a292f25"
                ></input>
            </p>
            <p>
                Token B address:{' '}
                <input
                    className={styles.inputAddress}
                    ref={tokenBRef}
                    type="text"
                    defaultValue="cxd57fe1c5e63385f412b814634102609e8a987e3a"
                ></input>
            </p>
            <p>
                Fee:{' '}
                <input ref={feeRef} type="number" defaultValue="500"></input>
            </p>
            <p>
                Pool Price:{' '}
                <input ref={feeRef} type="number" defaultValue="500"></input>
            </p>

            <p>
                <button
                    onClick={() => {
                        const tokenA = tokenARef.current.value;
                        const tokenB = tokenBRef.current.value;
                        const fee = parseInt(feeRef.current.value);
                        createAndInitializePoolIfNecessary(
                            tokenA,
                            tokenB,
                            fee,
                        ).then((txHash) => {
                            setTxHashResult(txHash);
                        });
                    }}
                >
                    Create
                </button>
            </p>

            {txHashResult && (
                <p>
                    TxHash:{' '}
                    <a
                        href={
                            'https://tracker.berlin.icon.community/transaction/' +
                            txHashResult
                        }
                    >
                        {txHashResult}
                    </a>
                </p>
            )}
        </div>
    );
}
