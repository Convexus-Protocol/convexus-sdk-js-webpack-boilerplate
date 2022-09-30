import {Contract} from '@convexus/icon-toolkit';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {getAddressFromBookmark} from '../getAddressFromBookmark';
import ISwapRouter from '@src/artifacts/contracts/SwapRouter/SwapRouter.json';
import {SwapRouter} from '@convexus/sdk';

export const swapRouterAddress = getAddressFromBookmark('Swap Router');

SwapRouter.setContractAddress(swapRouterAddress);

export const swapRouterContract = new Contract(
    swapRouterAddress,
    ISwapRouter,
    iconService,
    debugService,
    networkId,
);
