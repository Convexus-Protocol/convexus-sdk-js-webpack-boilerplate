import React, {useCallback, useEffect, useRef, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import * as styles from './styles.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {Percent, CurrencyAmount, Token, MaxUint256} from '@convexus/sdk-core';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {balanceOf} from '@src/components/utils/contract/Token/balanceOf';
import tryParseCurrencyAmount from '@src/components/utils/parse/tryParseCurrencyAmount';
import {TxHashLink} from '@src/components/common/TxHashLink';
import {TransactionInfo} from '@src/components/common/TransactionInfo';
import {getPosition} from '@src/components/utils/contract/NonfungiblePositionManager/getPosition';
import {NonfungiblePositionManager, Position} from '@convexus/sdk';
import {TokenIdPosition} from '@src/components/common/TokenIdPosition';
import {nonfungiblePositionManagerContract} from '@src/components/utils/contract/NonfungiblePositionManager/getContract';
import {getNameContract} from '@src/components/utils/contract/Name/getContract';

export function ModuleIncreaseLiquidity() {
    const [tokenId, setTokenId] = useState<any>();
    const [amount0, setAmount0] = useState<any>();
    const [amount1, setAmount1] = useState<any>();
    const [fieldChanged, setFieldChanged] = useState<any>();
    const [balances, setBalances] = useState<CurrencyAmount<Token>[]>();
    const [txs, setTxs] = useState<TransactionInfo[]>();
    const [position, setPosition] = useState<Position>();
    const amount0Ref = useRef<any>();
    const amount1Ref = useRef<any>();
    const wallet = getUserWallet();
    const tokenIdRef = useRef<any>();
    const [currentPosition, setCurrentPosition] = useState<any>();
    const [initialPosition, setInitialPosition] = useState<any>();
    const pool = currentPosition?.pool;

    const onAmount0Changed = useCallback(
        (node: any) => {
            if (!pool) return;
            if (!node.value) return;
            setAmount0(
                tryParseCurrencyAmount(node.value, pool.token0).quotient,
            );
            setFieldChanged('amount0');
        },
        [pool],
    );

    const onAmount1Changed = useCallback(
        (node: any) => {
            if (!pool) return;
            if (!node.value) return;
            setAmount1(
                tryParseCurrencyAmount(node.value, pool.token1).quotient,
            );
            setFieldChanged('amount1');
        },
        [pool],
    );

    useEffect(() => {
        // Check inputs
        if (!fieldChanged) return;
        if (!pool) return;
        if (!amount0 && !amount1) return;

        // Parse and manage amounts
        let amount0Pos = fieldChanged != 'amount1' ? amount0 : MaxUint256;
        let amount1Pos = fieldChanged != 'amount0' ? amount1 : MaxUint256;

        const position = Position.fromAmounts({
            pool: pool,
            tickLower: currentPosition.tickLower,
            tickUpper: currentPosition.tickUpper,
            amount0: amount0Pos ?? MaxUint256,
            amount1: amount1Pos ?? MaxUint256,
            useFullPrecision: true,
        });

        setPosition(position);
        updatePositionUI(position);
    }, [fieldChanged]);

    const updatePositionUI = (position: Position) => {
        if (fieldChanged != 'amount0') {
            amount0Ref.current.value = position.amount0.toSignificant();
            setAmount0(position.amount0.quotient);
        }
        if (fieldChanged != 'amount1') {
            amount1Ref.current.value = position.amount1.toSignificant();
            setAmount1(position.amount1.quotient);
        }

        setFieldChanged(null);
    };

    const onUpdatePosition = async () => {
        // Check inputs
        if (!position) return;
        if (!initialPosition) return;

        const slippageTolerance = new Percent(100, 100); // Don't care about slippage for testing
        const deadline = Date.now() + 60 * 10; // 10 minute deadline

        const calldatas = NonfungiblePositionManager.addCallParameters(
            position,
            {
                tokenId,
                slippageTolerance,
                deadline,
            },
        );

        // Send txs
        const txss: TransactionInfo[] = [];
        for (const calldata of calldatas) {
            const txHash = await nonfungiblePositionManagerContract.buildSend(
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
    };

    const onLoadPosition = async () => {
        if (!tokenIdRef.current.value) return;

        // Get current position
        const tokenId: number = parseInt(tokenIdRef.current.value);
        const position = await getPosition(tokenId);
        setInitialPosition(position);
        setCurrentPosition(position);
        setPosition(position);

        // Get balances
        const balance0 = await balanceOf(
            position.pool.token0,
            wallet.getAddress(),
        );
        const balance1 = await balanceOf(
            position.pool.token1,
            wallet.getAddress(),
        );

        setTokenId(tokenId);
        setBalances([balance0, balance1]);
    };

    return (
        <div className={appStyles.module} id="ModuleIncreaseLiquidity">
            <ModuleHeader
                text={'Increase liquidity'}
                name={'ModuleIncreaseLiquidity'}
            />

            <p>
                Token ID: &nbsp;
                <input type="number" ref={tokenIdRef}></input>
            </p>

            <p>
                <button onClick={() => onLoadPosition()}>Load position</button>
            </p>

            {position && (
                <TokenIdPosition tokenId={tokenId} position={initialPosition} />
            )}

            {balances && position && (
                <>
                    <p>
                        Pool {pool.token0.symbol + ' / ' + pool.token1.symbol}
                    </p>
                    <p>Pool price: {pool.token0Price.toSignificant(10)}</p>

                    <hr />

                    <p>
                        Lower bound price:
                        <input
                            type="number"
                            disabled
                            defaultValue={position.token0PriceLower.toSignificant()}
                            className={styles.input}
                        />
                    </p>

                    <p>
                        Upper bound price:
                        <input
                            type="number"
                            disabled
                            defaultValue={position.token0PriceUpper.toSignificant()}
                            className={styles.input}
                        />
                    </p>

                    <p>
                        {pool.token0.symbol} amount (balance in wallet:
                        {balances[0].toSignificant(10)}):
                        <input
                            type="number"
                            // if upper bound is lower than pool price, disable amount0
                            disabled={
                                currentPosition.tickUpper < pool.tickCurrent
                            }
                            className={styles.input}
                            ref={amount0Ref}
                            onChange={(e) => onAmount0Changed(e.target)}
                            defaultValue={0}
                        />
                    </p>

                    <p>
                        {pool.token1.symbol} amount (balance in wallet:
                        {balances[1].toSignificant(10)}):
                        <input
                            type="number"
                            // if upper bound is lower than pool price, disable amount0
                            disabled={
                                currentPosition.tickLower > pool.tickCurrent
                            }
                            className={styles.input}
                            ref={amount1Ref}
                            onChange={(e) => onAmount1Changed(e.target)}
                            defaultValue={0}
                        />
                    </p>

                    <p>
                        <button
                            onClick={() => {
                                onUpdatePosition();
                            }}
                        >
                            Add liquidity
                        </button>
                    </p>

                    {txs &&
                        txs.map((tx: any, i: number) => (
                            <p key={i}>
                                - {tx.name}::{tx.method}
                                <TxHashLink txHash={tx.hash} />
                            </p>
                        ))}
                </>
            )}
        </div>
    );
}
