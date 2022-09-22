import {NonfungiblePositionManager} from '@convexus/sdk';
import {getAddressFromBookmark} from '../getAddressFromBookmark';
import INonfungiblePositionManager from '@src/artifacts/contracts/NonfungiblePositionManager/NonfungiblePositionManager.json';
import {Contract} from '@convexus/icon-toolkit';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';

const nonfungiblePositionManagerAddress =
    getAddressFromBookmark('Position Manager');

NonfungiblePositionManager.setContractAddress(
    nonfungiblePositionManagerAddress,
);

export const nonfungiblePositionManagerContract = new Contract(
    nonfungiblePositionManagerAddress,
    INonfungiblePositionManager,
    iconService,
    debugService,
    networkId,
);
