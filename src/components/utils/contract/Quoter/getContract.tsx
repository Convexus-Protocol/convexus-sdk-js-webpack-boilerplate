import {Contract} from '@convexus/icon-toolkit';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {getAddressFromBookmark} from '../getAddressFromBookmark';
import IQuoter from '@src/artifacts/contracts/Quoter/Quoter.json';

export const quoterAddress = getAddressFromBookmark('Quoter');

export const quoterContract = new Contract(
    quoterAddress,
    IQuoter,
    iconService,
    debugService,
    networkId,
);
