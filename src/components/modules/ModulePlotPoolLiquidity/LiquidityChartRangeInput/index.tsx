import React, {ReactNode, useCallback, useMemo} from 'react';
import {BarChart2, CloudOff, Inbox} from 'react-feather';

import {Currency, Price, Token} from '@convexus/sdk-core';
import {FeeAmount, Pool} from '@convexus/sdk';
import {AutoColumn, ColumnCenter} from './components/Column';
import Loader from './components/Loader';
import {format} from 'd3';
import {saturate} from 'polished';
import {Bound} from './actions/Bound';
import styled, {useTheme} from 'styled-components';

import {ThemedText} from './theme';
import {Chart} from './Chart';
import {useDensityChartData} from './hooks';
import {ZoomLevels} from './types';
import {TickData} from './hooks/computeSurroundingTicks';

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
    [FeeAmount.LOWEST]: {
        initialMin: 0.999,
        initialMax: 1.001,
        min: 0.00001,
        max: 1.5,
    },
    [FeeAmount.LOW]: {
        initialMin: 0.999,
        initialMax: 1.001,
        min: 0.00001,
        max: 1.5,
    },
    [FeeAmount.MEDIUM]: {
        initialMin: 0.5,
        initialMax: 2,
        min: 0.00001,
        max: 20,
    },
    [FeeAmount.HIGH]: {
        initialMin: 0.5,
        initialMax: 2,
        min: 0.00001,
        max: 20,
    },
};

const ChartWrapper = styled.div`
    position: relative;

    justify-content: center;
    align-content: center;
`;

function InfoBox({message, icon}: {message?: ReactNode; icon: ReactNode}) {
    return (
        <ColumnCenter style={{height: '100%', justifyContent: 'center'}}>
            {icon}
            {message && (
                <ThemedText.DeprecatedMediumHeader
                    padding={10}
                    marginTop="20px"
                    textAlign="center"
                >
                    {message.toString()}
                </ThemedText.DeprecatedMediumHeader>
            )}
        </ColumnCenter>
    );
}

export default function LiquidityChartRangeInput({
    pool,
    ticks,
    currencyA,
    currencyB,
    feeAmount,
    ticksAtLimit,
    price,
    priceLower,
    priceUpper,
    onLeftRangeInput,
    onRightRangeInput,
    interactive,
}: {
    pool: Pool;
    ticks: readonly TickData[] | undefined;
    currencyA: Currency | undefined;
    currencyB: Currency | undefined;
    feeAmount?: FeeAmount;
    ticksAtLimit: {[bound in Bound]?: boolean | undefined};
    price: number | undefined;
    priceLower?: Price<Token, Token>;
    priceUpper?: Price<Token, Token>;
    onLeftRangeInput: (typedValue: string) => void;
    onRightRangeInput: (typedValue: string) => void;
    interactive: boolean;
}) {
    const theme = useTheme();

    const tokenAColor = '#2172E5';
    const tokenBColor = '#E52172';

    const isSorted =
        currencyA &&
        currencyB &&
        currencyA?.wrapped.sortsBefore(currencyB?.wrapped);

    const {isLoading, error, formattedData} = useDensityChartData({
        pool,
        currencyA,
        currencyB,
        feeAmount,
        ticks,
    });

    const onBrushDomainChangeEnded = useCallback(
        (domain: [number, number], mode: string | undefined) => {
            let leftRangeValue = Number(domain[0]);
            const rightRangeValue = Number(domain[1]);

            if (leftRangeValue <= 0) {
                leftRangeValue = 1 / 10 ** 6;
            }

            // simulate user input for auto-formatting and other validations
            if (
                (!ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER] ||
                    mode === 'handle' ||
                    mode === 'reset') &&
                leftRangeValue > 0
            ) {
                onLeftRangeInput(leftRangeValue.toFixed(6));
            }

            if (
                (!ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER] ||
                    mode === 'reset') &&
                rightRangeValue > 0
            ) {
                // todo: remove this check. Upper bound for large numbers
                // sometimes fails to parse to tick.
                if (rightRangeValue < 1e35) {
                    onRightRangeInput(rightRangeValue.toFixed(6));
                }
            }
        },
        [isSorted, onLeftRangeInput, onRightRangeInput, ticksAtLimit],
    );

    interactive = interactive && Boolean(formattedData?.length);

    const brushDomain: [number, number] | undefined = useMemo(() => {
        const leftPrice = isSorted ? priceLower : priceUpper?.invert();
        const rightPrice = isSorted ? priceUpper : priceLower?.invert();

        return leftPrice && rightPrice
            ? [
                  parseFloat(leftPrice?.toSignificant(6)),
                  parseFloat(rightPrice?.toSignificant(6)),
              ]
            : undefined;
    }, [isSorted, priceLower, priceUpper]);

    const brushLabelValue = useCallback(
        (d: 'w' | 'e', x: number) => {
            if (!price) return '';

            if (d === 'w' && ticksAtLimit[isSorted ? Bound.LOWER : Bound.UPPER])
                return '0';
            if (d === 'e' && ticksAtLimit[isSorted ? Bound.UPPER : Bound.LOWER])
                return '∞';

            const percent =
                (x < price ? -1 : 1) *
                ((Math.max(x, price) - Math.min(x, price)) / price) *
                100;

            return price
                ? `${format(Math.abs(percent) > 1 ? '.2~s' : '.2~f')(percent)}%`
                : '';
        },
        [isSorted, price, ticksAtLimit],
    );

    if (error) {
        console.error('exception', {
            description: error.toString(),
            fatal: false,
        });
    }

    const isUninitialized =
        !currencyA || !currencyB || (formattedData === undefined && !isLoading);

    return (
        <AutoColumn gap="md" style={{minHeight: '200px'}}>
            {isUninitialized ? (
                <InfoBox
                    message={'Your position will appear here.'}
                    icon={<Inbox size={56} stroke={'#FFFFFF'} />}
                />
            ) : isLoading ? (
                <InfoBox icon={<Loader size="40px" stroke={'#B2B9D2'} />} />
            ) : error ? (
                <InfoBox
                    message={'Liquidity data not available.'}
                    icon={<CloudOff size={56} stroke={'#B2B9D2'} />}
                />
            ) : !formattedData || !price ? (
                <InfoBox
                    message={'There is no liquidity data.'}
                    icon={<BarChart2 size={56} stroke={'#B2B9D2'} />}
                />
            ) : (
                <ChartWrapper>
                    <Chart
                        data={{series: formattedData, current: price}}
                        dimensions={{width: 400, height: 200}}
                        margins={{top: 10, right: 2, bottom: 20, left: 0}}
                        styles={{
                            area: {
                                selection: '#2172E5',
                            },
                            brush: {
                                handle: {
                                    west:
                                        saturate(0.1, tokenAColor) ??
                                        theme.deprecated_red1,
                                    east:
                                        saturate(0.1, tokenBColor) ?? '#2172E5',
                                },
                            },
                        }}
                        interactive={interactive}
                        brushLabels={brushLabelValue}
                        brushDomain={brushDomain}
                        onBrushDomainChange={onBrushDomainChangeEnded}
                        zoomLevels={ZOOM_LEVELS[feeAmount ?? FeeAmount.MEDIUM]}
                        ticksAtLimit={ticksAtLimit}
                    />
                </ChartWrapper>
            )}
        </AutoColumn>
    );
}
