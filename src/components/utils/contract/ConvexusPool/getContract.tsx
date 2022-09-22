import IConvexusPool from '@src/artifacts/contracts/ConvexusPool/ConvexusPool.json';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {Contract} from '@convexus/icon-toolkit';

export function getPoolContract(poolAddress: string) {
    return new Contract(
        poolAddress,
        IConvexusPool,
        iconService,
        debugService,
        networkId,
    );
}
