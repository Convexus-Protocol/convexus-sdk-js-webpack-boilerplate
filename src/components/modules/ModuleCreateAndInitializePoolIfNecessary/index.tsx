import React, {useRef, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import * as styles from './styles.module.less';
import {createAndInitializePoolIfNecessary} from './createAndInitializePoolIfNecessary';
import {ModuleHeader} from '../../common/ModuleHeader';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {TxHashLink} from '@src/components/common/TxHashLink';

export function ModuleCreateAndInitializePoolIfNecessary() {
    const tokenARef = useRef<any>();
    const tokenBRef = useRef<any>();
    const feeRef = useRef<any>();
    const [txHashResult, setTxHashResult] = useState<string>();

    const onCreateAndInitializerPoolIfNecessary = () => {
        const tokenA = tokenARef.current.value;
        const tokenB = tokenBRef.current.value;
        const fee = parseInt(feeRef.current.value);
        createAndInitializePoolIfNecessary(tokenA, tokenB, fee).then(
            (txHash) => {
                setTxHashResult(txHash);
            },
        );
    };

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
                Token A address:
                <input
                    className={styles.inputAddress}
                    ref={tokenARef}
                    type="text"
                    defaultValue={getAddressFromBookmark('WETH')}
                ></input>
            </p>
            <p>
                Token B address:
                <input
                    className={styles.inputAddress}
                    ref={tokenBRef}
                    type="text"
                    defaultValue={getAddressFromBookmark('CRV')}
                ></input>
            </p>
            <p>
                Fee:
                <input ref={feeRef} type="number" defaultValue="500"></input>
            </p>

            <p>
                <button onClick={() => onCreateAndInitializerPoolIfNecessary()}>
                    Create
                </button>
            </p>

            {txHashResult && (
                <p>
                    TxHash:
                    <TxHashLink txHash={txHashResult} />
                </p>
            )}
        </div>
    );
}
