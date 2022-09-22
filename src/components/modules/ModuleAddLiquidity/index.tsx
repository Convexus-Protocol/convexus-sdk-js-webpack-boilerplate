import React, {useCallback, useEffect, useRef, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import * as styles from './styles.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {
    CurrencyAmount,
    Token,
    Percent,
    MaxUint256,
    Rounding,
} from '@convexus/sdk-core';
import {NonfungiblePositionManager, Pool, Position} from '@convexus/sdk';
import {getPoolFromAddress} from '@src/components/utils/contract/ConvexusPool/getPoolFromAddress';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {getBalanceOfToken} from '@src/components/utils/contract/Token/getBalanceOfToken';
import tryParseCurrencyAmount from '@src/components/utils/parse/tryParseCurrencyAmount';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {TxHashLink} from '@src/components/common/TxHashLink';
import {TransactionInfo} from '@src/components/common/TransactionInfo';
import {tryParsePriceToTick} from '@src/components/utils/parse/tryParsePriceToTick';
import {nonfungiblePositionManagerContract} from '@src/components/utils/contract/NonfungiblePositionManager/getContract';
import {getNameContract} from '@src/components/utils/contract/Name/getContract';
import classNames from 'classnames/bind';
let cx = classNames.bind(styles);

export function ModuleAddLiquidity() {
    const [pool, setPool] = useState<Pool>();
    const [tickLower, setTickLower] = useState<any>();
    const [tickUpper, setTickUpper] = useState<any>();
    const [amount0, setAmount0] = useState<any>();
    const [amount1, setAmount1] = useState<any>();
    const [fieldChanged, setFieldChanged] = useState<any>();
    const [balances, setBalances] = useState<CurrencyAmount<Token>[]>();
    const [txs, setTxs] = useState<TransactionInfo[]>();
    const [position, setPosition] = useState<Position>();
    const poolAddressRef = useRef<any>();
    const amount0Ref = useRef<any>();
    const amount1Ref = useRef<any>();
    const wallet = getUserWallet();

    const onLowerTickChanged = useCallback(
        (node: any) => {
            if (!pool) return;
            if (!node.value) return;
            setTickLower(tryParsePriceToTick(pool, node.value));
            setFieldChanged('lower');
        },
        [pool],
    );

    const onUpperTickChanged = useCallback(
        (node: any) => {
            if (!pool) return;
            if (!node.value) return;
            setTickUpper(tryParsePriceToTick(pool, node.value));
            setFieldChanged('upper');
        },
        [pool],
    );

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
        if (!tickLower) return;
        if (!tickUpper) return;
        if (!amount0 && !amount1) return;

        // Invalid position
        if (tickLower >= tickUpper) return;

        // Parse and manage amounts
        let amount0Pos = fieldChanged != 'amount1' ? amount0 : MaxUint256;
        let amount1Pos = fieldChanged != 'amount0' ? amount1 : MaxUint256;

        const position = Position.fromAmounts({
            pool: pool,
            tickLower: tickLower,
            tickUpper: tickUpper,
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

    const onCreatePosition = async () => {
        // Check inputs
        if (!position) return;

        // Parameters
        const slippageTolerance = new Percent(100, 100); // don't care about slippage for testing
        const deadline = Date.now() + 60 * 10; // 10 minute deadline

        const calldatas = NonfungiblePositionManager.addCallParameters(
            position,
            {
                recipient: wallet.getAddress(),
                slippageTolerance,
                deadline,
            },
        );

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

            setTxs([...txs]);
        }
    };

    const onLoadPool = () => {
        const poolAddress = poolAddressRef.current.value;
        getPoolFromAddress(poolAddress).then(async (pool) => {
            const balance0 = await getBalanceOfToken(
                pool.token0,
                wallet.getAddress(),
            );
            const balance1 = await getBalanceOfToken(
                pool.token1,
                wallet.getAddress(),
            );
            setPool(pool);
            setBalances([balance0, balance1]);
        });
    };

    return (
        <div className={appStyles.module} id="ModuleAddLiquidity">
            <ModuleHeader
                text={'Add liquidity to a pool'}
                name={'ModuleAddLiquidity'}
            />

            <p>
                Pool address:
                <input
                    ref={poolAddressRef}
                    className={styles.input}
                    type="text"
                    defaultValue={getAddressFromBookmark('WETH/CRV Pool')}
                />
                <button onClick={() => onLoadPool()}>Load pool</button>
            </p>

            {pool && balances && (
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
                            // Default lower price: pool.token0Price / 2
                            defaultValue={pool.token0Price.asFraction
                                .divide(2)
                                .multiply(pool.token0Price.scalar)
                                .toSignificant(10)}
                            className={cx(
                                styles.input,
                                tickLower >= tickUpper ? styles.inputRed : '',
                            )}
                            ref={onLowerTickChanged}
                            onChange={(e) => onLowerTickChanged(e.target)}
                        />
                    </p>

                    <p>
                        Upper bound price:
                        <input
                            type="number"
                            // Default upper price: pool.token0Price * 2
                            defaultValue={pool.token0Price.asFraction
                                .multiply(2)
                                .multiply(pool.token0Price.scalar)
                                .toSignificant(10)}
                            className={cx(
                                styles.input,
                                tickLower >= tickUpper ? styles.inputRed : '',
                            )}
                            ref={onUpperTickChanged}
                            onChange={(e) => onUpperTickChanged(e.target)}
                        />
                    </p>

                    <p>
                        {pool.token0.symbol} amount (balance in wallet:
                        {balances[0].toSignificant(10)}):
                        <input
                            type="number"
                            // if upper bound is lower than pool price, disable amount0
                            disabled={tickUpper < pool.tickCurrent}
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
                            disabled={tickLower > pool.tickCurrent}
                            className={styles.input}
                            ref={amount1Ref}
                            onChange={(e) => onAmount1Changed(e.target)}
                            defaultValue={0}
                        />
                    </p>

                    <p>
                        <button
                            onClick={() => {
                                onCreatePosition();
                            }}
                        >
                            Create position
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
