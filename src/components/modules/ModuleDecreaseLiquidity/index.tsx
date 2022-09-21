import React, {useEffect, useRef, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {Contract} from '@convexus/icon-toolkit';
import {NonfungiblePositionManager, Position} from '@convexus/sdk';
import {Percent, CurrencyAmount} from '@convexus/sdk-core';
import {getPosition} from '@src/components/utils/contract/NonfungiblePositionManager/getPosition';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import INonfungiblePositionManager from '@src/artifacts/contracts/NonfungiblePositionManager/NonfungiblePositionManager.json';
import IName from '@src/artifacts/contracts/Name/Name.json';
import {TransactionInfo} from '@src/components/common/TransactionInfo';

import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {TxHashLink} from '@src/components/common/TxHashLink';
import {TokenIdPosition} from '@src/components/common/TokenIdPosition';

export const nonfungiblePositionManagerAddress =
    getAddressFromBookmark('Position Manager');

export const nonfungiblePositionManagerContract = new Contract(
    nonfungiblePositionManagerAddress,
    INonfungiblePositionManager,
    iconService,
    debugService,
    networkId,
);

export const ModuleDecreaseLiquidity = () => {
    const tokenIdRef = useRef<any>();
    const [liquidityRangePercent, setLiquidityRangePercent] =
        useState<any>(100);
    const [txs, setTxs] = useState<TransactionInfo[]>();
    const [tokenIdPosition, setTokenIdPosition] = useState<any>();
    const [newPosition, setNewPosition] = useState<any>();

    useEffect(() => {
        if (!tokenIdPosition) return;
        const position = tokenIdPosition.position;
        const liquidityPercentage = new Percent(liquidityRangePercent, 100);
        const partialPosition = new Position({
            pool: position.pool,
            liquidity: liquidityPercentage.multiply(position.liquidity)
                .quotient,
            tickLower: position.tickLower,
            tickUpper: position.tickUpper,
        });
        setNewPosition(partialPosition);
    }, [tokenIdPosition, liquidityRangePercent]);

    const onDecreaseLiquidity = async () => {
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
                liquidityPercentage: new Percent(
                    100 - liquidityRangePercent,
                    100,
                ), // 100 - liquidityRangePercent %
                slippageTolerance,
                deadline,
                burnToken: liquidityRangePercent === 0, // only burn if the liquidity is entirely removed
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

    const onLoadPosition = async () => {
        if (!tokenIdRef.current.value) return;

        // Get current position
        const tokenId: number = parseInt(tokenIdRef.current.value);
        const position = await getPosition(tokenId);
        setTokenIdPosition({tokenId: tokenId, position: position});
        setNewPosition(position);
    };

    return (
        <div className={appStyles.module} id="ModuleDecreaseLiquidity">
            <ModuleHeader
                text={'Decrease liquidity'}
                name={'ModuleDecreaseLiquidity'}
            />

            <p>
                Token ID: &nbsp;
                <input type="number" ref={tokenIdRef}></input>
            </p>

            <p>
                <button onClick={() => onLoadPosition()}>Load position</button>
            </p>

            {tokenIdPosition && newPosition && (
                <>
                    <TokenIdPosition
                        tokenId={tokenIdPosition.tokenId}
                        position={tokenIdPosition.position}
                    />
                    <p>Reduce liquidity: {liquidityRangePercent}%</p>
                    <p>
                        New position : &nbsp;
                        {newPosition.amount0.toSignificant()}{' '}
                        {newPosition.pool.token0.symbol} -{' '}
                        {newPosition.amount1.toSignificant()}{' '}
                        {newPosition.pool.token1.symbol}
                    </p>
                    <p>
                        <input
                            onChange={(e) =>
                                setLiquidityRangePercent(
                                    parseInt(e.target.value),
                                )
                            }
                            type="range"
                            defaultValue={100}
                        ></input>
                    </p>
                    <p>
                        <button onClick={() => onDecreaseLiquidity()}>
                            Decrease liquidity
                        </button>
                    </p>
                </>
            )}

            {txs &&
                txs.map((tx, i) => (
                    <p key={i}>
                        - {tx.name}::{tx.method} <TxHashLink txHash={tx.hash} />
                    </p>
                ))}
        </div>
    );
};
