import {Token, Icx} from '@convexus/sdk-core';
import {getTokenInfo} from './getTokenInfo';

export async function getTokenFromAddress(
    tokenAddress: string,
): Promise<Token> {
    if (Icx.isWrappedAddress(tokenAddress)) {
        return new Icx().wrapped;
    }

    const tokenInfo = await getTokenInfo(tokenAddress);

    return new Token(
        tokenInfo.address,
        tokenInfo.decimals,
        tokenInfo.symbol,
        tokenInfo.name,
    );
}
