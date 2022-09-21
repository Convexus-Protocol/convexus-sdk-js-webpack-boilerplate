import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {Contract} from '@convexus/icon-toolkit';
import INonfungiblePositionManager from '@src/artifacts/contracts/NonfungiblePositionManager/NonfungiblePositionManager.json';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';

import {getTokenFromAddress} from '@src/components/utils/contract/Token/getTokenFromAddress';
import {getPoolFromAddress} from '@src/components/utils/contract/ConvexusPool/getPoolFromAddress';
import {getPoolAddress} from '@src/components/utils/contract/ConvexusFactory/getPoolAddress';
import {Position, tickToPrice} from '@convexus/sdk';

const nonfungiblePositionManagerAddress =
    getAddressFromBookmark('Position Manager');

const nonfungiblePositionManagerContract = new Contract(
    nonfungiblePositionManagerAddress,
    INonfungiblePositionManager,
    iconService,
    debugService,
    networkId,
);

export async function getPosition(tokenId: number) {
    const position = await nonfungiblePositionManagerContract.positions(
        tokenId,
    );

    const [token0, token1] = await Promise.all([
        getTokenFromAddress(position.token0),
        getTokenFromAddress(position.token1),
    ]);

    const fee = parseInt(position.fee);

    const pool = await getPoolFromAddress(
        await getPoolAddress(token0.address, token1.address, fee),
    );

    return new Position({
        pool: pool,
        liquidity: position.liquidity,
        tickLower: parseInt(position.tickLower),
        tickUpper: parseInt(position.tickUpper),
    });
}
