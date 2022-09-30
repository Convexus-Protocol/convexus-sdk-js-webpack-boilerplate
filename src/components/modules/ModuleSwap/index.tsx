import React, {useRef, useState} from 'react';

import {
    Pool,
    Route,
    SwapQuoter,
    QuoteResult,
    Trade,
    SwapRouter,
} from '@convexus/sdk';
import * as styles from './styles.module.less';
import * as appStyles from '@components/app/app.module.less';
import {getPoolFromAddress} from '@components/utils/contract/ConvexusPool/getPoolFromAddress';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {
    Currency,
    CurrencyAmount,
    Percent,
    Price,
    Token,
    TradeType,
} from '@convexus/sdk-core';
import {factoryContract} from '@src/components/utils/contract/ConvexusFactory/getContract';
import tryParseCurrencyAmount from '@src/components/utils/parse/tryParseCurrencyAmount';
import {DefaultFactoryProvider} from '@src/components/utils/contract/ConvexusFactory/getPoolAddress';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {swapRouterContract} from '@src/components/utils/contract/SwapRouter/getContract';
import {getNameContract} from '@src/components/utils/contract/Name/getContract';
import {TransactionInfo} from '@src/components/common/TransactionInfo';
import {TxHashLink} from '@src/components/common/TxHashLink';

export function ModuleSwap() {
    const inputRef = useRef<any>();
    const amount0Ref = useRef<any>();
    const amount1Ref = useRef<any>();
    const [pool, setPool] = useState<Pool>();
    const [priceAfter, setPriceAfter] = useState<Price<Currency, Currency>>();
    const [tokenA, setTokenA] = useState<Token>();
    const [tokenB, setTokenB] = useState<Token>();
    const [txs, setTxs] = useState<TransactionInfo[]>();

    const onReadPool = () => {
        const contractAddress = inputRef.current.value;
        getPoolFromAddress(contractAddress).then((pool) => {
            setPool(pool);
            setTokenA(pool.token0);
            setTokenB(pool.token1);
        });
    };

    const onAmount0Changed = () => {
        if (!pool) return;
        if (!amount0Ref.current.value) return;
        if (!tokenA || !tokenB) return;

        const amount0 = tryParseCurrencyAmount(
            amount0Ref.current.value,
            tokenA,
        );
        amount1Ref.current.disabled = true;
        const route = new Route([pool], tokenA, tokenB);

        SwapQuoter.setContractAddress(getAddressFromBookmark('Quoter'));
        const calldata = SwapQuoter.quoteCallParameters(
            route,
            amount0,
            TradeType.EXACT_INPUT,
        );

        factoryContract
            .buildCall(calldata[0])
            .then((result: any) => {
                const quoteResult = QuoteResult.fromCall(result);
                amount1Ref.current.value = CurrencyAmount.fromRawAmount(
                    tokenB,
                    quoteResult.amountOut,
                ).toSignificant();
                amount1Ref.current.disabled = false;
                let poolPrice = Price.fromSqrtPrice(
                    pool.token0,
                    pool.token1,
                    quoteResult.sqrtPriceX96After,
                );
                if (!pool.token0.equals(tokenA)) {
                    poolPrice = poolPrice.invert();
                }
                setPriceAfter(poolPrice);
            })
            .catch(() => {
                console.error('Not enough liquidity in pool');
            });
    };

    const onAmount1Changed = () => {
        if (!pool) return;
        if (!amount1Ref.current.value) return;
        if (!tokenA || !tokenB) return;

        const amount1 = tryParseCurrencyAmount(
            amount1Ref.current.value,
            tokenB,
        );
        amount0Ref.current.disabled = true;
        const route = new Route([pool], tokenA, tokenB);

        SwapQuoter.setContractAddress(getAddressFromBookmark('Quoter'));
        const calldata = SwapQuoter.quoteCallParameters(
            route,
            amount1,
            TradeType.EXACT_OUTPUT,
        );

        factoryContract
            .buildCall(calldata[0])
            .then((result: any) => {
                const quoteResult = QuoteResult.fromCall(result);
                amount0Ref.current.value = CurrencyAmount.fromRawAmount(
                    tokenA,
                    quoteResult.amountOut,
                ).toSignificant();
                amount0Ref.current.disabled = false;
                let poolPrice = Price.fromSqrtPrice(
                    pool.token0,
                    pool.token1,
                    quoteResult.sqrtPriceX96After,
                );
                if (!pool.token0.equals(tokenA)) {
                    poolPrice = poolPrice.invert();
                }
                setPriceAfter(poolPrice);
            })
            .catch(() => {
                console.error('Not enough liquidity in pool');
            });
    };

    const onInvertTokens = () => {
        if (!pool) return;

        setPriceAfter(undefined);
        amount0Ref.current.value = '';
        amount1Ref.current.value = '';

        if (tokenA?.equals(pool.token0)) {
            setTokenA(pool.token1);
            setTokenB(pool.token0);
        } else {
            setTokenA(pool.token0);
            setTokenB(pool.token1);
        }
    };

    const onSwap = () => {
        if (!pool) return;
        if (!tokenA || !tokenB) return;

        const amount0 = tryParseCurrencyAmount(
            amount0Ref.current.value,
            tokenA,
        );

        const amount1 = tryParseCurrencyAmount(
            amount1Ref.current.value,
            tokenB,
        );

        const route = new Route([pool], tokenA, tokenB);
        Trade.createUncheckedTrade(new DefaultFactoryProvider(), {
            route: route,
            inputAmount: amount0,
            outputAmount: amount1,
            tradeType: TradeType.EXACT_INPUT,
        }).then(async (trade) => {
            const wallet = getUserWallet();
            const slippageTolerance = new Percent(100, 100); // dont care about slippage for testing
            const recipient = wallet.getAddress();
            const deadline = Date.now() + 60 * 10; // 10 minute deadline

            const calldatas = SwapRouter.swapCallParameters(trade, {
                slippageTolerance,
                recipient,
                deadline,
            });

            console.log('calldata=', calldatas);

            // deposit tokens & mint the NFT position
            const txs = [];
            for (const calldata of calldatas) {
                const txHash = await swapRouterContract.buildSend(
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
        });
    };

    return (
        <div className={appStyles.module} id="ModuleSwap">
            <ModuleHeader text={'Swap Tokens'} name={'ModuleSwap'} />
            <input
                ref={inputRef}
                className={styles.inputAddress}
                type="text"
                defaultValue={getAddressFromBookmark('WETH/CRV Pool')}
            />

            <button onClick={() => onReadPool()}>Load this pool</button>

            {pool && tokenA && tokenB && (
                <div className={styles.swapContainer}>
                    <p>
                        Current price: 1 {tokenA.symbol} ={' '}
                        {tokenA.equals(pool.token0)
                            ? pool.token0Price.toSignificant()
                            : pool.token1Price.toSignificant()}{' '}
                        {tokenB.symbol}
                    </p>

                    <p>
                        <button onClick={() => onInvertTokens()}>Invert</button>
                    </p>

                    <p>
                        Sell {tokenA.symbol}:
                        <input
                            ref={amount0Ref}
                            className={styles.inputAddress}
                            type="number"
                            onChange={() => onAmount0Changed()}
                        />
                    </p>

                    <p>
                        Buy {tokenB.symbol}:
                        <input
                            ref={amount1Ref}
                            className={styles.inputAddress}
                            type="number"
                            onChange={() => onAmount1Changed()}
                        />
                    </p>

                    <p>
                        Price after:{' '}
                        {priceAfter
                            ? `1 ${
                                  tokenA.symbol
                              } = ${priceAfter.toSignificant()} ${
                                  tokenB.symbol
                              }`
                            : '?'}
                    </p>

                    <button onClick={() => onSwap()}>Swap</button>

                    {txs &&
                        txs.map((tx: any, i: number) => (
                            <p key={i}>
                                - {tx.name}::{tx.method}
                                <TxHashLink txHash={tx.hash} />
                            </p>
                        ))}
                </div>
            )}
        </div>
    );
}
