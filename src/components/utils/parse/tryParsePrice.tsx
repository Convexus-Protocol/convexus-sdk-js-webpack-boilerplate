import JSBI from 'jsbi';
import {Token, Price} from '@convexus/sdk-core';

export function tryParsePrice(
    baseToken: Token,
    quoteToken: Token,
    value: string,
): Price<Token, Token> {
    if (!value.match(/^\d*\.?\d+$/)) {
        throw new Error(`Invalid price "${value}"`);
    }

    const [whole, fraction] = value.split('.');

    const decimals = fraction?.length ?? 0;
    const withoutDecimals = JSBI.BigInt((whole ?? '') + (fraction ?? ''));

    return new Price(
        baseToken,
        quoteToken,
        JSBI.multiply(
            JSBI.BigInt(10 ** decimals),
            JSBI.BigInt(10 ** baseToken.decimals),
        ),
        JSBI.multiply(withoutDecimals, JSBI.BigInt(10 ** quoteToken.decimals)),
    );
}
