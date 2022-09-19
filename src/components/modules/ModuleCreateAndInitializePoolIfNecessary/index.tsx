import React, {useRef, useState} from 'react';

import IconService from 'icon-sdk-js';
import * as appStyles from '@components/app/app.module.less';
import {Pool, encodeSqrtRatioX96, PoolInitializer} from '@convexus/sdk';
import {Contract} from '@convexus/icon-toolkit';
import IConvexusPoolInitializer from '@src/artifacts/contracts/ConvexusPoolInitializer/ConvexusPoolInitializer.json';
import IRC2 from '@src/artifacts/contracts/IRC2/IRC2.json';
import {Token} from '@convexus/sdk-core';
import {getTokenInfo} from '@components/utils/getTokenInfo';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/getProviders';
import * as styles from './styles.module.less';

const poolInitializerAddress = 'cxbb201b891324246a2c35fbcfb3db67145ab12b3a';
const poolInitializerContract = new Contract(
    poolInitializerAddress,
    IConvexusPoolInitializer,
    iconService,
    debugService,
    networkId,
);

async function createAndInitializePoolIfNecessary(
    addressTokenA: string,
    AddresstokenB: string,
    fee: number,
) {
    // Get tokens information
    const contractA = new Contract(
        addressTokenA,
        IRC2,
        iconService,
        debugService,
        networkId,
    );
    const contractB = new Contract(
        AddresstokenB,
        IRC2,
        iconService,
        debugService,
        networkId,
    );
    const [infoA, infoB] = await Promise.all([
        getTokenInfo(contractA),
        getTokenInfo(contractB),
    ]);

    // Create two tokens
    const tokenA = new Token(
        infoA.address,
        infoA.decimals,
        infoA.symbol,
        infoA.name,
    );
    const tokenB = new Token(
        infoB.address,
        infoB.decimals,
        infoB.symbol,
        infoB.name,
    );

    // Instanciate a new pool
    // Default price = 1:1
    const sqrtPriceX96 = encodeSqrtRatioX96(1, 1);
    const liquidity = 0;
    const tickCurrent = 0;
    const pool = new Pool(
        tokenA,
        tokenB,
        fee,
        sqrtPriceX96,
        liquidity,
        tickCurrent,
    );

    // Get the calldata for creating the pool
    const {calldata, value} = PoolInitializer.createCallParameters(pool);

    // Replace the target address from the calldata
    calldata[0].to = calldata[0].to.replace(
        'PoolInitializer',
        poolInitializerAddress,
    );

    // Put the calldata in a tx and send it
    const wallet = IconService.IconWallet.loadPrivateKey(
        '573b555367d6734ea0fecd0653ba02659fa19f7dc6ee5b93ec781350bda27376',
    );
    const txHash = await poolInitializerContract.buildSend(
        calldata[0].method,
        wallet,
        calldata[0],
    );
    await iconService.waitTransactionResult(txHash);

    return txHash;
}

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
            <h1>
                <pre>Create a new pool</pre>
            </h1>

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
