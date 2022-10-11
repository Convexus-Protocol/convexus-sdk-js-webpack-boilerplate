import React, {useEffect, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {TokenIdPosition} from '@src/components/common/TokenIdPosition';
import {getOwnedTokenIdPositions} from '@src/components/utils/contract/NonfungiblePositionManager/getOwnedTokenIdPositions';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {getPosition} from '@src/components/utils/contract/NonfungiblePositionManager/getPosition';
import {Percent, CurrencyAmount, Token} from '@convexus/sdk-core';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {NonfungiblePositionManager, Position} from '@convexus/sdk';
import {TransactionInfo} from '@src/components/common/TransactionInfo';
import {TxHashLink} from '@src/components/common/TxHashLink';
import {getNameContract} from '@src/components/utils/contract/Name/getContract';
import {nonfungiblePositionManagerContract} from '@src/components/utils/contract/NonfungiblePositionManager/getContract';
import {poolReadonlyContract} from '@src/components/utils/contract/PoolReadOnly/getContract';
import JSBI from 'jsbi';

type PositionInfo = {
    position: Position;
    tokenId: number;
    owed0: CurrencyAmount<Token>;
    owed1: CurrencyAmount<Token>;
};

export const ModuleListOfPositions = () => {
    const [posInfos, setPosInfos] = useState<PositionInfo[]>();
    const [txs, setTxs] = useState<TransactionInfo[]>([]);
    const [claimTxs, setClaimTxs] =
        useState<{index: number; txs: TransactionInfo[]}>();

    const refreshPositions = () => {
        getOwnedTokenIdPositions().then((tokenIdPositions) => {
            Promise.all(
                tokenIdPositions.map((tokenIdPosition) => {
                    const posMgr = getAddressFromBookmark('Position Manager');
                    const factory = getAddressFromBookmark('Factory');
                    const wallet = getUserWallet();
                    return poolReadonlyContract
                        .getOwedFeesNFT(
                            posMgr,
                            factory,
                            tokenIdPosition.tokenId,
                        )
                        .then((result: any) => {
                            return {
                                tokenId: tokenIdPosition.tokenId,
                                position: tokenIdPosition.position,
                                owed0: CurrencyAmount.fromRawAmount(
                                    tokenIdPosition.position.pool.token0,
                                    JSBI.BigInt(result['amount0']),
                                ),
                                owed1: CurrencyAmount.fromRawAmount(
                                    tokenIdPosition.position.pool.token1,
                                    JSBI.BigInt(result['amount1']),
                                ),
                            };
                        });
                }),
            ).then((posInfos) => {
                setPosInfos(posInfos);
            });
        });
    };

    useEffect(() => {
        refreshPositions();
    }, []);

    const decreaseLiquidityAndBurn = async (tokenId: number) => {
        // Get current position
        const position = await getPosition(tokenId);
        const slippageTolerance = new Percent(100, 100); // Don't care about slippage for testing
        const deadline = Date.now() + 60 * 10; // 10 minute deadline
        const wallet = getUserWallet();

        return NonfungiblePositionManager.removeCallParameters(position, {
            tokenId,
            liquidityPercentage: new Percent(100, 100), // remove all liquidity
            slippageTolerance,
            deadline,
            burnToken: true, // burn the token
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
        });
    };

    const onCloseAllPositions = async () => {
        if (!posInfos) return;

        const wallet = getUserWallet();
        const txss: TransactionInfo[] = [];

        posInfos.forEach(async (tokenIdPosition) => {
            const calldatas = await decreaseLiquidityAndBurn(
                tokenIdPosition.tokenId,
            );

            // Send txs
            for (const calldata of calldatas) {
                const txHash =
                    await nonfungiblePositionManagerContract.buildSend(
                        wallet,
                        calldata,
                        true,
                    );

                // Read contract name
                const nameContract = getNameContract(calldata['to']);

                txss.push({
                    hash: txHash,
                    name: await nameContract.name(),
                    method: calldata['method'],
                });

                setTxs([...txss]);
            }
        });
    };

    const onClaimFees = async (posInfo: PositionInfo, index: number) => {
        const wallet = getUserWallet();
        const calldatas = NonfungiblePositionManager.collectCallParameters({
            tokenId: posInfo.tokenId,
            expectedCurrencyOwed0: CurrencyAmount.fromRawAmount(
                posInfo.position.pool.token0,
                0,
            ),
            expectedCurrencyOwed1: CurrencyAmount.fromRawAmount(
                posInfo.position.pool.token1,
                0,
            ),
            recipient: wallet.getAddress(),
        });

        // deposit tokens & mint the NFT position
        const txs = [];
        for (const calldata of calldatas) {
            const txHash = await nonfungiblePositionManagerContract.buildSend(
                wallet,
                calldata,
                true,
            );

            // Read contract name
            const nameContract = getNameContract(calldata['to']);

            txs.push({
                hash: txHash,
                name: await nameContract.name(),
                method: calldata['method'],
            });

            setClaimTxs({index: index, txs: [...txs]});
        }
    };

    return (
        <div className={appStyles.module} id="ModuleListOfPositions">
            <ModuleHeader
                text={'List of opened positions'}
                name={'ModuleListOfPositions'}
            />

            {!posInfos && 'Loading...'}

            {posInfos && (
                <>
                    {posInfos.map((posInfo: PositionInfo, key: number) => (
                        <>
                            <TokenIdPosition
                                key={key}
                                tokenId={posInfo.tokenId}
                                position={posInfo.position}
                            />
                            <p>
                                <button
                                    onClick={() => onClaimFees(posInfo, key)}
                                >
                                    Claim fees
                                </button>
                                &nbsp;
                                {posInfo.owed0.toSignificant(4)}{' '}
                                {posInfo.position.pool.token0.symbol} /{' '}
                                {posInfo.owed1.toSignificant(4)}{' '}
                                {posInfo.position.pool.token1.symbol}
                            </p>
                            <br />
                            <p>
                                {claimTxs &&
                                    claimTxs.index == key &&
                                    claimTxs.txs.map((tx, i) => (
                                        <p key={i}>
                                            - {tx.name}::{tx.method}
                                            <TxHashLink txHash={tx.hash} />
                                        </p>
                                    ))}
                            </p>
                        </>
                    ))}
                    <br />
                    <button onClick={() => refreshPositions()}>
                        Refresh positions
                    </button>
                    <button onClick={() => onCloseAllPositions()}>
                        Close all positions
                    </button>
                </>
            )}

            {txs &&
                txs.map((tx, i) => (
                    <p key={i}>
                        - {tx.name}::{tx.method}
                        <TxHashLink txHash={tx.hash} />
                    </p>
                ))}
        </div>
    );
};
