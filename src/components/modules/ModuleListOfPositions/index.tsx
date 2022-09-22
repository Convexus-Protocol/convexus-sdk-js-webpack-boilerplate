import React, {useEffect, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {TokenIdPosition} from '@src/components/common/TokenIdPosition';
import {getOwnedTokenIdPositions} from '@src/components/utils/contract/NonfungiblePositionManager/getOwnedTokenIdPositions';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {Contract} from '@convexus/icon-toolkit';
import INonfungiblePositionManager from '@src/artifacts/contracts/NonfungiblePositionManager/NonfungiblePositionManager.json';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {getPosition} from '@src/components/utils/contract/NonfungiblePositionManager/getPosition';
import {Percent, CurrencyAmount} from '@convexus/sdk-core';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {NonfungiblePositionManager} from '@convexus/sdk';
import {TransactionInfo} from '@src/components/common/TransactionInfo';
import {TxHashLink} from '@src/components/common/TxHashLink';
import {getNameContract} from '@src/components/utils/contract/Name/getContract';
import {nonfungiblePositionManagerContract} from '@src/components/utils/contract/NonfungiblePositionManager/getContract';

export const ModuleListOfPositions = () => {
    const [tokenIdPositions, setTokenIdPositions] = useState<any[]>();
    const [txs, setTxs] = useState<TransactionInfo[]>([]);

    const refreshPositions = () => {
        getOwnedTokenIdPositions().then((tokenIdPositions) =>
            setTokenIdPositions(tokenIdPositions),
        );
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
        if (!tokenIdPositions) return;

        const wallet = getUserWallet();
        const txss: TransactionInfo[] = [];

        tokenIdPositions.forEach(async (tokenIdPosition) => {
            const calldatas = await decreaseLiquidityAndBurn(
                tokenIdPosition.tokenId,
            );

            // Send txs
            for (const calldata of calldatas) {
                const txHash =
                    await nonfungiblePositionManagerContract.buildSend(
                        wallet,
                        calldata,
                    );

                await iconService.getTransactionResult(txHash);

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

    return (
        <div className={appStyles.module} id="ModuleListOfPositions">
            <ModuleHeader
                text={'List of opened positions'}
                name={'ModuleListOfPositions'}
            />

            {!tokenIdPositions && 'Loading...'}

            {tokenIdPositions && (
                <>
                    {tokenIdPositions.map((position: any, key: number) => (
                        <TokenIdPosition
                            key={key}
                            tokenId={position.tokenId}
                            position={position.position}
                        />
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
