import React, {useRef, useState} from 'react';
import JSBI from 'jsbi';

import * as appStyles from '@components/app/app.module.less';
import * as styles from './styles.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {
    CurrencyAmount,
    Price,
    Token,
    Percent,
    MaxUint256,
} from '@convexus/sdk-core';
import {
    nearestUsableTick,
    NonfungiblePositionManager,
    Pool,
    Position,
    priceToClosestTick,
    tickToPrice,
    TICK_SPACINGS,
} from '@convexus/sdk';
import {balanceOf} from '@src/components/utils/contract/Token/balanceOf';
import tryParseCurrencyAmount from '@src/components/utils/parse/tryParseCurrencyAmount';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {TxHashLink} from '@src/components/common/TxHashLink';
import {TransactionInfo} from '@src/components/common/TransactionInfo';
import {tryParsePriceToTick} from '@src/components/utils/parse/tryParsePriceToTick';
import {nonfungiblePositionManagerContract} from '@src/components/utils/contract/NonfungiblePositionManager/getContract';
import {getNameContract} from '@src/components/utils/contract/Name/getContract';
import classNames from 'classnames/bind';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {getPoolFromAddress} from '@src/components/utils/contract/ConvexusPool/getPoolFromAddress';
let cx = classNames.bind(styles);

export function ModuleAddLiquidity() {
    const [pool, setPool] = useState<Pool>();
    const [tickLower, setTickLower] = useState<any>();
    const [tickUpper, setTickUpper] = useState<any>();
    const [amount0, setAmount0] = useState<any>();
    const [amount1, setAmount1] = useState<any>();
    const [balances, setBalances] = useState<CurrencyAmount<Token>[]>();
    const [txs, setTxs] = useState<TransactionInfo[]>();
    const [position, setPosition] = useState<Position>();
    const poolAddressRef = useRef<any>();
    const amount0Ref = useRef<any>();
    const amount1Ref = useRef<any>();
    const wallet = getUserWallet();

    const onLowerTickChanged = (node: any) => {
        if (!pool) return;
        if (!node || !node.value) return;
        const newTickLower = tryParsePriceToTick(pool, node.value);
        setTickLower(newTickLower);
        updatePosition('lower', amount0, amount1, newTickLower, tickUpper);
    };

    const onUpperTickChanged = (node: any) => {
        if (!pool) return;
        if (!node || !node.value) return;
        const newTickUpper = tryParsePriceToTick(pool, node.value);
        setTickUpper(newTickUpper);
        updatePosition('upper', amount0, amount1, tickLower, newTickUpper);
    };

    const onAmount0Changed = (node: any) => {
        if (!pool) return;
        if (!node || !node.value) return;
        const newAmount0 = tryParseCurrencyAmount(
            node.value,
            pool.token0,
        ).quotient;
        setAmount0(newAmount0);
        updatePosition('amount0', newAmount0, amount1, tickLower, tickUpper);
    };

    const onAmount1Changed = (node: any) => {
        if (!pool) return;
        if (!node || !node.value) return;
        const newAmount1 = tryParseCurrencyAmount(
            node.value,
            pool.token1,
        ).quotient;
        setAmount1(newAmount1);
        updatePosition('amount1', amount0, newAmount1, tickLower, tickUpper);
    };

    const updatePosition = (
        fieldChanged: string,
        amount0: JSBI,
        amount1: JSBI,
        tickLower: number,
        tickUpper: number,
    ) => {
        // Check inputs
        if (!pool) return;
        if (tickLower == undefined) return;
        if (tickUpper == undefined) return;
        if (!amount0 && !amount1) return;

        // Invalid position
        if (tickLower >= tickUpper) return;

        // Parse and manage amounts
        amount0 = fieldChanged != 'amount1' ? amount0 : MaxUint256;
        amount1 = fieldChanged != 'amount0' ? amount1 : MaxUint256;

        const position = Position.fromAmounts({
            pool: pool,
            tickLower: tickLower,
            tickUpper: tickUpper,
            amount0: amount0 ?? MaxUint256,
            amount1: amount1 ?? MaxUint256,
            useFullPrecision: true,
        });

        // Update amounts
        if (fieldChanged != 'amount0') {
            amount0Ref.current.value = position.amount0.toSignificant();
            setAmount0(position.amount0.quotient);
        }
        if (fieldChanged != 'amount1') {
            amount1Ref.current.value = position.amount1.toSignificant();
            setAmount1(position.amount1.quotient);
        }

        setPosition(position);
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
            const balance0 = await balanceOf(pool.token0, wallet.getAddress());
            const balance1 = await balanceOf(pool.token1, wallet.getAddress());
            setPool(pool);
            setBalances([balance0, balance1]);

            // Initial lower tick : price / 2
            const lowerPrice = pool.token0Price.asFraction.divide(2);
            setTickLower(
                nearestUsableTick(
                    priceToClosestTick(
                        new Price(
                            pool.token0,
                            pool.token1,
                            lowerPrice.denominator,
                            lowerPrice.numerator,
                        ),
                    ),
                    TICK_SPACINGS[pool.fee],
                ),
            );

            // Initial upper tick : price * 2
            const upperPrice = pool.token0Price.asFraction.multiply(2);
            setTickUpper(
                nearestUsableTick(
                    priceToClosestTick(
                        new Price(
                            pool.token0,
                            pool.token1,
                            upperPrice.denominator,
                            upperPrice.numerator,
                        ),
                    ),
                    TICK_SPACINGS[pool.fee],
                ),
            );
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

            {pool &&
                balances &&
                tickLower !== undefined &&
                tickUpper !== undefined && (
                    <>
                        <p>
                            Pool{' '}
                            {pool.token0.symbol + ' / ' + pool.token1.symbol}
                        </p>
                        <p>Pool price: {pool.token0Price.toSignificant(10)}</p>

                        <hr />

                        <p>
                            Lower bound price:
                            <input
                                type="number"
                                defaultValue={tickToPrice(
                                    pool.token0,
                                    pool.token1,
                                    tickLower,
                                ).toSignificant()}
                                className={cx(
                                    styles.input,
                                    tickLower >= tickUpper
                                        ? styles.inputRed
                                        : '',
                                )}
                                onChange={(e) => onLowerTickChanged(e.target)}
                            />
                        </p>

                        <p>
                            Upper bound price:
                            <input
                                type="number"
                                defaultValue={tickToPrice(
                                    pool.token0,
                                    pool.token1,
                                    tickUpper,
                                ).toSignificant()}
                                className={cx(
                                    styles.input,
                                    tickLower >= tickUpper
                                        ? styles.inputRed
                                        : '',
                                )}
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
