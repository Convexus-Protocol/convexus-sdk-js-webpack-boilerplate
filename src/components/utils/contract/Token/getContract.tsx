import IIRC2 from '@src/artifacts/contracts/IRC2/IRC2.json';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {Contract} from '@convexus/icon-toolkit';

export function getIrc2Contract(tokenAddress: string) {
    return new Contract(
        tokenAddress,
        IIRC2,
        iconService,
        debugService,
        networkId,
    );
}
