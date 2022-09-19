import IconService from 'icon-sdk-js';
import {Pool, encodeSqrtRatioX96, PoolInitializer} from '@convexus/sdk';
import {Contract} from '@convexus/icon-toolkit';
import IRC2 from '@src/artifacts/contracts/IRC2/IRC2.json';
import {Token} from '@convexus/sdk-core';
import {getTokenInfo} from '@components/utils/getTokenInfo';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/getProviders';

import IConvexusPoolInitializer from '@src/artifacts/contracts/ConvexusPoolInitializer/ConvexusPoolInitializer.json';

export const poolInitializerAddress =
    'cxbb201b891324246a2c35fbcfb3db67145ab12b3a';
export const poolInitializerContract = new Contract(
    poolInitializerAddress,
    IConvexusPoolInitializer,
    iconService,
    debugService,
    networkId,
);
export async function createAndInitializePoolIfNecessary(
    addressTokenA: string,
    AddresstokenB: string,
    fee: number,
) {
    // Get tokens information
    const contractA = new Contract(
        addressTokenA,
        IRC2,
        iconService,
        debugService,
        networkId,
    );
    const contractB = new Contract(
        AddresstokenB,
        IRC2,
        iconService,
        debugService,
        networkId,
    );
    const [infoA, infoB] = await Promise.all([
        getTokenInfo(contractA),
        getTokenInfo(contractB),
    ]);

    // Create two tokens
    const tokenA = new Token(
        infoA.address,
        infoA.decimals,
        infoA.symbol,
        infoA.name,
    );
    const tokenB = new Token(
        infoB.address,
        infoB.decimals,
        infoB.symbol,
        infoB.name,
    );

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
    const {calldata, value} = PoolInitializer.createCallParameters(pool);

    // Replace the target address from the calldata
    calldata[0].to = calldata[0].to.replace(
        'PoolInitializer',
        poolInitializerAddress,
    );

    // Put the calldata in a tx and send it
    const wallet = IconService.IconWallet.loadPrivateKey(
        '573b555367d6734ea0fecd0653ba02659fa19f7dc6ee5b93ec781350bda27376',
    );
    const txHash = await poolInitializerContract.buildSend(
        calldata[0].method,
        wallet,
        calldata[0],
    );
    await iconService.waitTransactionResult(txHash);

    return txHash;
}
