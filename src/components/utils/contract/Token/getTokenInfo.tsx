import {Contract} from '@convexus/icon-toolkit';

import IIRC2 from '@src/artifacts/contracts/IRC2/IRC2.json';
import {iconService, debugService, networkId} from '../getProviders';

export async function getTokenInfo(tokenAddress: string) {
    const contract = new Contract(
        tokenAddress,
        IIRC2,
        iconService,
        debugService,
        networkId,
    );

    const result = await Promise.all([
        contract.decimals(),
        contract.symbol(),
        contract.name(),
    ]);

    return {
        address: contract.address,
        decimals: parseInt(result[0]),
        symbol: result[1],
        name: result[2],
    };
}
