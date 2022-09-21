import React, {useRef, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {Contract} from '@convexus/icon-toolkit';
import {NonfungiblePositionManager} from '@convexus/sdk';
import {Percent, CurrencyAmount} from '@convexus/sdk-core';
import {getPosition} from '@src/components/utils/contract/NonfungiblePositionManager/getPosition';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import INonfungiblePositionManager from '@src/artifacts/contracts/NonfungiblePositionManager/NonfungiblePositionManager.json';
import IName from '@src/artifacts/contracts/Name/Name.json';
import {TransactionInfo} from '@src/components/utils/contract/TransactionInfo';

import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {TxHashLink} from '@src/components/common/TxHashLink';

export const nonfungiblePositionManagerAddress =
    getAddressFromBookmark('Position Manager');

export const nonfungiblePositionManagerContract = new Contract(
    nonfungiblePositionManagerAddress,
    INonfungiblePositionManager,
    iconService,
    debugService,
    networkId,
);

export const ModuleDeletePosition = () => {
    const tokenIdRef = useRef<any>();
    const [txs, setTxs] = useState<TransactionInfo[]>();

    const onDeletePosition = async () => {
        if (!tokenIdRef.current.value) return;

        // Get current position
        const tokenId: number = parseInt(tokenIdRef.current.value);
        const position = await getPosition(tokenId);
        const slippageTolerance = new Percent(5, 100); // 5% slippage
        const deadline = Date.now() + 60 * 10; // 10 minute deadline
        const wallet = getUserWallet();

        // Remove the whole liquidity from current position
        NonfungiblePositionManager.setContractAddress(
            nonfungiblePositionManagerAddress,
        );

        const calldatas = NonfungiblePositionManager.removeCallParameters(
            position,
            {
                tokenId,
                liquidityPercentage: new Percent(100, 100), // 100%
                slippageTolerance,
                deadline,
                burnToken: true,
                collectOptions: {
                    expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
                        position.pool.token0,
                        0,
                    ),
                    expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
                        position.pool.token1,
                        0,
                    ),
                    recipient: wallet.getAddress(),
                },
            },
        );

        console.log(calldatas);

        const txs = [];
        for (const calldata of calldatas) {
            const txHash = await nonfungiblePositionManagerContract.buildSend(
                wallet,
                calldata,
            );

            await iconService.getTransactionResult(txHash);

            // Read contract name
            const nameContract = new Contract(
                calldata['to'],
                IName,
                iconService,
                debugService,
                networkId,
            );

            txs.push({
                hash: txHash,
                name: await nameContract.name(),
                method: calldata['method'],
            });

            setTxs([...txs]);
        }
    };

    return (
        <div className={appStyles.module} id="ModuleDeletePosition">
            <ModuleHeader
                text={'Delete a position'}
                name={'ModuleDeletePosition'}
            />

            <p>
                Token ID: &nbsp;
                <input type="number" ref={tokenIdRef}></input>
            </p>

            <p>
                <button onClick={() => onDeletePosition()}>
                    Delete position
                </button>
            </p>

            {txs &&
                txs.map((tx, i) => (
                    <p key={i}>
                        - {tx.name}::{tx.method} <TxHashLink txHash={tx.hash} />
                    </p>
                ))}
        </div>
    );
};
