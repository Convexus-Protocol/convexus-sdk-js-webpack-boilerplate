import React, {useRef, useState} from 'react';
import JSBI from 'jsbi';

import * as appStyles from '@components/app/app.module.less';
import * as styles from './styles.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {Contract} from '@convexus/icon-toolkit';
import {CurrencyAmount, Token, Percent, MaxUint256} from '@convexus/sdk-core';
import {NonfungiblePositionManager, Pool, Position} from '@convexus/sdk';
import {getPoolFromAddress} from '@src/components/utils/contract/ConvexusPool/getPoolFromAddress';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {getBalanceOfToken} from '@src/components/utils/contract/Token/getBalanceOfToken';
import {tryParseTick} from '@src/components/utils/parse/tryParseTick';
import tryParseCurrencyAmount from '@src/components/utils/parse/tryParseCurrencyAmount';
import INonfungiblePositionManager from '@src/artifacts/contracts/NonfungiblePositionManager/NonfungiblePositionManager.json';
import IName from '@src/artifacts/contracts/Name/Name.json';
import bigDecimal from 'js-big-decimal';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {TxHashLink} from '@src/components/common/TxHashLink';
import {TransactionInfo} from '@src/components/common/TransactionInfo';

export const nonfungiblePositionManagerAddress =
    getAddressFromBookmark('Position Manager');

export const nonfungiblePositionManagerContract = new Contract(
    nonfungiblePositionManagerAddress,
    INonfungiblePositionManager,
    iconService,
    debugService,
    networkId,
);

export function ModuleAddLiquidity() {
    const [pool, setPool] = useState<Pool>();
    const [balances, setBalances] = useState<CurrencyAmount<Token>[]>();
    const [txs, setTxs] = useState<TransactionInfo[]>();
    const poolAddressRef = useRef<any>();
    const lowerBoundRef = useRef<any>();
    const upperBoundRef = useRef<any>();
    const amount0Ref = useRef<any>();
    const amount1Ref = useRef<any>();
    const wallet = getUserWallet();

    function parseBoundToTick(boundRef: React.MutableRefObject<any>): number {
        if (!pool) return 0;

        const bound = new bigDecimal(boundRef.current.value);

        return tryParseTick(
            pool.token0,
            pool.token1,
            pool.fee,
            bound.getValue(),
        );
    }

    function onFieldChanged(fieldChanged: string) {
        // Check inputs
        if (!pool) return;
        if (!lowerBoundRef.current.value) return;
        if (!upperBoundRef.current.value) return;

        // Parse and manage lower / upper ticks
        try {
            // Parse
            const tickLower = parseBoundToTick(lowerBoundRef);
            const tickUpper = parseBoundToTick(upperBoundRef);

            // Check if lower < upper
            if (tickLower >= tickUpper) {
                lowerBoundRef.current.style.border = '1px solid red';
                upperBoundRef.current.style.border = '1px solid red';
            } else {
                lowerBoundRef.current.style.border = '';
                upperBoundRef.current.style.border = '';
            }

            // if upper bound is lower than pool price, disable amount0
            if (tickUpper < pool.tickCurrent) {
                amount0Ref.current.disabled = true;
                amount0Ref.current.value = '';
                return;
            } else {
                amount0Ref.current.disabled = false;
            }

            // if lower bound is greater than pool price, disable amount1
            if (tickLower > pool.tickCurrent) {
                amount1Ref.current.disabled = true;
                amount1Ref.current.value = '';
                return;
            } else {
                amount1Ref.current.disabled = false;
            }

            // ----------------------------------

            // Parse and manage amounts
            let amount0 = MaxUint256;
            let amount1 = MaxUint256;

            switch (fieldChanged) {
                // amount0 changed, update amount1
                case 'amount0':
                    {
                        // Check inputs
                        if (!amount0Ref.current.value) return;

                        amount0 = tryParseCurrencyAmount(
                            amount0Ref.current.value,
                            pool.token0,
                        ).quotient;

                        const position = Position.fromAmount0({
                            pool: pool,
                            tickLower,
                            tickUpper,
                            amount0: amount0,
                            useFullPrecision: true,
                        });

                        amount1Ref.current.value =
                            position.amount1.toSignificant();
                    }
                    break;

                // amount1 changed, update amount0
                case 'amount1':
                    {
                        // Check inputs
                        if (!amount1Ref.current.value) return;

                        amount1 = tryParseCurrencyAmount(
                            amount1Ref.current.value,
                            pool.token1,
                        ).quotient;

                        const position = Position.fromAmount1({
                            pool: pool,
                            tickLower,
                            tickUpper,
                            amount1: amount1,
                        });

                        amount0Ref.current.value =
                            position.amount0.toSignificant();
                    }
                    break;

                // bounds changed, update amount0 and amount1
                case 'lower':
                case 'upper':
                    {
                        // Check inputs
                        if (!amount0Ref.current.value) return;
                        if (!amount1Ref.current.value) return;

                        amount0 = tryParseCurrencyAmount(
                            amount0Ref.current.value,
                            pool.token0,
                        ).quotient;

                        amount1 = tryParseCurrencyAmount(
                            amount1Ref.current.value,
                            pool.token1,
                        ).quotient;

                        const position = Position.fromAmounts({
                            pool: pool,
                            tickLower: tickLower,
                            tickUpper: tickUpper,
                            amount0: amount0,
                            amount1: amount1,
                            useFullPrecision: true,
                        });

                        amount0Ref.current.value =
                            position.amount0.toSignificant();
                        amount1Ref.current.value =
                            position.amount1.toSignificant();
                    }
                    break;
            }
        } catch (e) {
            console.error(e);
            return;
        }
    }

    const onCreatePosition = async () => {
        // Check inputs
        if (!pool) return;
        if (!amount0Ref.current.value && !amount1Ref.current.value) return;
        if (!lowerBoundRef.current.value) return;
        if (!upperBoundRef.current.value) return;

        const amount0 = amount0Ref.current.value
            ? tryParseCurrencyAmount(amount0Ref.current.value, pool.token0)
                  .quotient
            : MaxUint256;

        const amount1 = amount1Ref.current.value
            ? tryParseCurrencyAmount(amount1Ref.current.value, pool.token1)
                  .quotient
            : MaxUint256;

        const tickLower = parseBoundToTick(lowerBoundRef);
        const tickUpper = parseBoundToTick(upperBoundRef);

        // Check ticks
        if (tickLower >= tickUpper) return;

        let position;

        // Handle one-sided liquidity
        if (JSBI.equal(amount0, MaxUint256)) {
            position = Position.fromAmount1({
                pool: pool,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount1: amount1,
            });
        } else if (JSBI.equal(amount0, MaxUint256)) {
            position = Position.fromAmount0({
                pool: pool,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0: amount0,
                useFullPrecision: true,
            });
        } else {
            position = Position.fromAmounts({
                pool: pool,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0: amount0,
                amount1: amount1,
                useFullPrecision: true,
            });
        }
        const wallet = getUserWallet();
        const slippageTolerance = new Percent(1, 100);
        const deadline = Date.now() + 60 * 10; // 10 minute deadline

        NonfungiblePositionManager.setContractAddress(
            nonfungiblePositionManagerAddress,
        );
        const calldatas = NonfungiblePositionManager.addCallParameters(
            new Position({
                pool: pool,
                tickLower: tickLower,
                tickUpper: tickUpper,
                liquidity: position.liquidity,
            }),
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
                <button
                    onClick={() => {
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
                    }}
                >
                    Load pool
                </button>
            </p>

            {pool && balances && (
                <>
                    <p>
                        Pool {pool.token0.symbol + ' / ' + pool.token1.symbol}
                    </p>
                    <p>Pool price: {pool.token0Price.toSignificant(10)}</p>

                    <hr />

                    <p>
                        {/* cxf62cfd827aaf7e8b8d03efdd6e367eb97bdc0f44 */}
                        Lower bound price:
                        <input
                            onChange={() => onFieldChanged('lower')}
                            ref={lowerBoundRef}
                            className={styles.input}
                            defaultValue={pool.token0Price.asFraction
                                .divide(2)
                                .multiply(pool.token0Price.scalar)
                                .toSignificant(10)}
                            type="number"
                        />
                    </p>

                    <p>
                        Upper bound price:
                        <input
                            onChange={() => onFieldChanged('upper')}
                            ref={upperBoundRef}
                            className={styles.input}
                            defaultValue={pool.token0Price.asFraction
                                .multiply(2)
                                .multiply(pool.token0Price.scalar)
                                .toSignificant(10)}
                            type="number"
                        />
                    </p>

                    <p>
                        {pool.token0.symbol} amount (balance in wallet:
                        {balances[0].toSignificant(10)}):
                        <input
                            onChange={() => onFieldChanged('amount0')}
                            ref={amount0Ref}
                            className={styles.input}
                            type="number"
                        />
                    </p>

                    <p>
                        {pool.token1.symbol} amount (balance in wallet:
                        {balances[1].toSignificant(10)}):
                        <input
                            onChange={() => onFieldChanged('amount1')}
                            ref={amount1Ref}
                            className={styles.input}
                            type="number"
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
                        txs.map((tx, i) => (
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
