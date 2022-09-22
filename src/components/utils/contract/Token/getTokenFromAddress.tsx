import {Token, Icx} from '@convexus/sdk-core';
import {getIrc2Contract} from './getContract';

export async function getTokenFromAddress(
    tokenAddress: string,
): Promise<Token> {
    if (Icx.isWrappedAddress(tokenAddress)) {
        return new Icx().wrapped;
    }

    const contract = getIrc2Contract(tokenAddress);

    const result = await Promise.all([
        contract.decimals(),
        contract.symbol(),
        contract.name(),
    ]);

    return new Token(
        contract.address,
        parseInt(result[0]),
        result[1],
        result[2],
    );
}
