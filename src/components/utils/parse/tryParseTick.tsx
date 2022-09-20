import JSBI from 'jsbi';
import {
    encodeSqrtRatioX96,
    FeeAmount,
    nearestUsableTick,
    priceToClosestTick,
    TickMath,
    TICK_SPACINGS,
} from '@convexus/sdk';
import {Token} from '@convexus/sdk-core';
import {tryParsePrice} from './tryParsePrice';

export function tryParseTick(
    baseToken: Token,
    quoteToken: Token,
    feeAmount: FeeAmount,
    value: string,
): number {
    const price = tryParsePrice(baseToken, quoteToken, value);

    let tick: number;

    // check price is within min/max bounds, if outside return min/max
    const sqrtRatioX96 = encodeSqrtRatioX96(price.numerator, price.denominator);

    if (JSBI.greaterThanOrEqual(sqrtRatioX96, TickMath.MAX_SQRT_RATIO)) {
        tick = TickMath.MAX_TICK;
    } else if (JSBI.lessThanOrEqual(sqrtRatioX96, TickMath.MIN_SQRT_RATIO)) {
        tick = TickMath.MIN_TICK;
    } else {
        // this function is agnostic to the base, will always return the correct tick
        tick = priceToClosestTick(price);
    }

    return nearestUsableTick(tick, TICK_SPACINGS[feeAmount]);
}
