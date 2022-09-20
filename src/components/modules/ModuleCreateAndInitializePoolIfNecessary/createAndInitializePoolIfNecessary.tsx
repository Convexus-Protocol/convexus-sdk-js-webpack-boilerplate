import {Pool, encodeSqrtRatioX96, PoolInitializer} from '@convexus/sdk';
import {Contract} from '@convexus/icon-toolkit';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';

import IConvexusPoolInitializer from '@src/artifacts/contracts/ConvexusPoolInitializer/ConvexusPoolInitializer.json';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {getTokenFromAddress} from '@src/components/utils/contract/Token/getTokenFromAddress';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';

export const poolInitializerAddress =
    getAddressFromBookmark('Pool Initializer');

export const poolInitializerContract = new Contract(
    poolInitializerAddress,
    IConvexusPoolInitializer,
    iconService,
    debugService,
    networkId,
);

export async function createAndInitializePoolIfNecessary(
    addressTokenA: string,
    addressTokenB: string,
    fee: number,
) {
    // Create two tokens
    const tokenA = await getTokenFromAddress(addressTokenA);
    const tokenB = await getTokenFromAddress(addressTokenB);

    // Instanciate a new pool
    // Default price = 1:1
    const sqrtPriceX96 = encodeSqrtRatioX96(1, 1);
    const liquidity = 0;
    const tickCurrent = 0;
    const pool = new Pool(
        tokenA,
        tokenB,
        fee,
        sqrtPriceX96,
        liquidity,
        tickCurrent,
    );

    // Get the calldata for creating the pool
    PoolInitializer.setContractAddress(poolInitializerAddress);
    const calldata = PoolInitializer.createCallParameters(pool);
    if (calldata.length != 1) {
        throw new Error('invalid calldata length');
    }

    // Put the calldata in a tx and send it
    const wallet = getUserWallet();
    const txHash = await poolInitializerContract.buildSend(wallet, calldata[0]);
    await iconService.waitTransactionResult(txHash);

    return txHash;
}
