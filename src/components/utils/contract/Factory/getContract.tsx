import {Contract} from '@convexus/icon-toolkit';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {getAddressFromBookmark} from '../getAddressFromBookmark';
import IConvexusFactory from '@src/artifacts/contracts/ConvexusFactory/ConvexusFactory.json';

export const factoryAddress = getAddressFromBookmark('Factory');

export const factoryContract = new Contract(
    factoryAddress,
    IConvexusFactory,
    iconService,
    debugService,
    networkId,
);
