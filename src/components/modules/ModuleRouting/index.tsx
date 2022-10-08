import React, {useRef, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {
    Icx,
    Percent,
    Token,
    CurrencyAmount,
    TradeType,
} from '@convexus/sdk-core';
import {
    QuoteMultiResult,
    QuoteResult,
    SwapQuoter,
    SwapRouter,
    Trade,
} from '@convexus/sdk';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {DefaultFactoryProvider} from '@src/components/utils/contract/ConvexusFactory/getPoolAddress';
import {quoterContract} from '@src/components/utils/contract/Quoter/getContract';
import {getTokenFromAddress} from '@src/components/utils/contract/Token/getTokenFromAddress';
import tryParseCurrencyAmount from '@src/components/utils/parse/tryParseCurrencyAmount';
import {swapRouterContract} from '@src/components/utils/contract/SwapRouter/getContract';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {getNameContract} from '@src/components/utils/contract/Name/getContract';
import {TransactionInfo} from '@src/components/common/TransactionInfo';
import {TxHashLink} from '@src/components/common/TxHashLink';

export function ModuleRouting() {
    const tokenARef = useRef<any>();
    const tokenBRef = useRef<any>();
    const amountRef = useRef<any>();
    const [trades, setTrades] = useState<Trade<Token, Token, TradeType>[]>();
    const [amountsOut, setAmountsOut] = useState<CurrencyAmount<Token>[]>();
    const [txs, setTxs] = useState<TransactionInfo[]>();
    const [swapIndex, setSwapIndex] = useState<number>();

    const onSwap = async (
        trade: Trade<Token, Token, TradeType>,
        index: number,
    ) => {
        const wallet = getUserWallet();
        const slippageTolerance = new Percent(100, 100); // dont care about slippage for testing
        const recipient = wallet.getAddress();
        const deadline = Date.now() + 60 * 10; // 10 minute deadline

        const calldatas = SwapRouter.swapCallParameters(trade, {
            slippageTolerance,
            recipient,
            deadline,
        });

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
        setSwapIndex(index);
    };

    const onFindRoute = async () => {
        if (!amountRef.current.value) return;

        const tokenA = await getTokenFromAddress(tokenARef.current.value);
        const tokenB = await getTokenFromAddress(tokenBRef.current.value);
        const amount = tryParseCurrencyAmount(amountRef.current.value, tokenA);

        function tradesFromJson(json: any) {
            const poolFactoryProvider = new DefaultFactoryProvider();
            return Promise.all(
                json.map((j: any) =>
                    Trade.fromJsonMultipleRoutes(j, poolFactoryProvider),
                ),
            );
        }

        fetch(
            `https://router.convexus.net/routing/bestTradeExactIn?currencyInAddress=${
                tokenA.address
            }&currencyOutAddress=${
                tokenB.address
            }&currencyAmountIn=${amount.quotient.toString()}`,
        )
            .then((response) => response.json())
            .then((data) => {
                tradesFromJson(data).then(async (trades) => {
                    setTrades(trades);

                    // Estimate amounts out
                    Promise.all(
                        trades.map(
                            async (trade: Trade<Token, Token, TradeType>) => {
                                SwapQuoter.setContractAddress(
                                    getAddressFromBookmark('Quoter'),
                                );
                                const calldata = SwapQuoter.quoteCallParameters(
                                    trade.swaps[0].route,
                                    trade.swaps[0].inputAmount,
                                    TradeType.EXACT_INPUT,
                                );

                                return quoterContract
                                    .buildCall(calldata[0])
                                    .then((quoteResult) => {
                                        // Multi or single QuoteResult ?
                                        const amountOut =
                                            trade.swaps[0].route.tokenPath
                                                .length == 2
                                                ? QuoteResult.fromCall(
                                                      quoteResult,
                                                  ).amountOut
                                                : QuoteMultiResult.fromCall(
                                                      quoteResult,
                                                  ).amountOut;

                                        return CurrencyAmount.fromRawAmount(
                                            tokenB,
                                            amountOut,
                                        );
                                    });
                            },
                        ),
                    ).then((amountsOut) => {
                        setAmountsOut(amountsOut);
                    });
                });
            });
    };

    return (
        <div className={appStyles.module} id="ModuleRouting">
            <ModuleHeader text={'Find route'} name={'ModuleRouting'} />

            <p>Token input:</p>
            <select ref={tokenARef} name="tokenA">
                <option value={new Icx().wrapped.address}>ICX</option>
                <option value={getAddressFromBookmark('sICX')}>sICX</option>
                <option value={getAddressFromBookmark('USDT')}>USDT</option>
                <option value={getAddressFromBookmark('USDC')}>USDC</option>
                <option value={getAddressFromBookmark('bnUSD')}>bnUSD</option>
                <option value={getAddressFromBookmark('CRV')}>CRV</option>
                <option value={getAddressFromBookmark('WETH')}>WETH</option>
            </select>

            <p>Token output:</p>
            <select ref={tokenBRef} name="tokenB">
                <option value={new Icx().wrapped.address}>ICX</option>
                <option selected value={getAddressFromBookmark('sICX')}>
                    sICX
                </option>
                <option value={getAddressFromBookmark('USDT')}>USDT</option>
                <option value={getAddressFromBookmark('USDC')}>USDC</option>
                <option value={getAddressFromBookmark('bnUSD')}>bnUSD</option>
                <option value={getAddressFromBookmark('CRV')}>CRV</option>
                <option value={getAddressFromBookmark('WETH')}>WETH</option>
            </select>

            <p>Amount input:</p>
            <input ref={amountRef} type="number"></input>

            <p>
                <button onClick={() => onFindRoute()}>Find route</button>
            </p>

            {trades !== null &&
                trades?.length === 0 &&
                'No route or not enough liquidity found'}

            {trades &&
                amountsOut &&
                trades.map((trade: Trade<Token, Token, TradeType>, index) => (
                    <>
                        <br />
                        <p key={'trade-' + index}>Route Path {index + 1}:</p>
                        <p key={'swap-' + index}>
                            {trade.swaps[0].route.tokenPath.map(
                                (token, index: number) => (
                                    <>
                                        {token.symbol}{' '}
                                        {index !=
                                        trade.swaps[0].route.tokenPath.length -
                                            1
                                            ? ' ➡️ '
                                            : ''}
                                    </>
                                ),
                            )}
                            <p>
                                Amount out: {amountsOut[index].toSignificant()}{' '}
                                {amountsOut[index].currency.symbol}
                            </p>
                            <p>
                                <button onClick={() => onSwap(trade, index)}>
                                    Perform this trade
                                </button>
                            </p>

                            {txs &&
                                swapIndex == index &&
                                txs.map((tx: any, i: number) => (
                                    <p key={i}>
                                        - {tx.name}::{tx.method}
                                        <TxHashLink txHash={tx.hash} />
                                    </p>
                                ))}
                        </p>
                    </>
                ))}
        </div>
    );
}
