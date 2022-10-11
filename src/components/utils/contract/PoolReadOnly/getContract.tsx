import {Contract} from '@convexus/icon-toolkit';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {getAddressFromBookmark} from '../getAddressFromBookmark';
import IPoolReadOnly from '@src/artifacts/contracts/PoolReadOnly/PoolReadOnly.json';

export const poolReadonlyAddress = getAddressFromBookmark('Pool ReadOnly');

export const poolReadonlyContract = new Contract(
    poolReadonlyAddress,
    IPoolReadOnly,
    iconService,
    debugService,
    networkId,
);
