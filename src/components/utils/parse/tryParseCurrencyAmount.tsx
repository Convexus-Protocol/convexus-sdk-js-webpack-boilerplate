import {Currency, CurrencyAmount} from '@convexus/sdk-core';
import JSBI from 'jsbi';
import {parseUnits} from '@ethersproject/units';

/**
 * Parses a CurrencyAmount from the passed string.
 * Returns the CurrencyAmount
 */
export default function tryParseCurrencyAmount<T extends Currency>(
    value: string,
    currency: T,
): CurrencyAmount<T> {
    const typedValueParsed = parseUnits(value, currency.decimals).toString();
    const result = CurrencyAmount.fromRawAmount(
        currency,
        JSBI.BigInt(typedValueParsed),
    );

    return result;
}
