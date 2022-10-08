import {Token, Icx} from '@convexus/sdk-core';
import {getIrc2Contract} from './getContract';

export async function getTokenFromAddress(
    tokenAddress: string,
): Promise<Token> {
    if (Icx.isWrappedAddress(tokenAddress)) {
        return new Icx().wrapped;
    }

    return Token.fromContract(getIrc2Contract(tokenAddress));
}
