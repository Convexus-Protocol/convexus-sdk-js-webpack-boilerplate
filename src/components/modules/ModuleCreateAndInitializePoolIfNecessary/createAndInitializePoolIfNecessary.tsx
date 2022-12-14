import {Pool, encodeSqrtRatioX96, PoolInitializer} from '@convexus/sdk';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {getTokenFromAddress} from '@src/components/utils/contract/Token/getTokenFromAddress';
import {poolInitializerContract} from '@src/components/utils/contract/PoolInitializer/getContract';

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
    const calldata = PoolInitializer.createCallParameters(pool);
    if (calldata.length != 1) {
        throw new Error('invalid calldata length');
    }

    // Put the calldata in a tx and send it
    const wallet = getUserWallet();
    const txHash = await poolInitializerContract.buildSend(
        wallet,
        calldata[0],
        true,
    );

    return txHash;
}
