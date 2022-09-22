import {Contract} from '@convexus/icon-toolkit';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import IName from '@src/artifacts/contracts/Name/Name.json';

export const getNameContract = (to: string) => {
    // Read contract name
    return new Contract(to, IName, iconService, debugService, networkId);
};
