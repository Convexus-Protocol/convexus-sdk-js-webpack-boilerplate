import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {getTokenFromAddress} from '@src/components/utils/contract/Token/getTokenFromAddress';
import {tickToPrice} from '@convexus/sdk';
import {getPool} from '@src/components/utils/contract/ConvexusFactory/getPool';
import {getPoolFromAddress} from '@src/components/utils/contract/ConvexusPool/getPoolFromAddress';

import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {Contract} from '@convexus/icon-toolkit';
import INonfungiblePositionManager from '@src/artifacts/contracts/NonfungiblePositionManager/NonfungiblePositionManager.json';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';

export const nonfungiblePositionManagerAddress =
    getAddressFromBookmark('Position Manager');

export const nonfungiblePositionManagerContract = new Contract(
    nonfungiblePositionManagerAddress,
    INonfungiblePositionManager,
    iconService,
    debugService,
    networkId,
);

export async function getPositionsInfo() {
    const wallet = getUserWallet();
    const count = parseInt(
        await nonfungiblePositionManagerContract.balanceOf(wallet.getAddress()),
    );
    const indexes = [...Array(count).keys()]; // range(count)
    const tokenIds = await Promise.all(
        indexes.map((index) =>
            nonfungiblePositionManagerContract.tokenOfOwnerByIndex(
                wallet.getAddress(),
                index,
            ),
        ),
    );
    const positions = await Promise.all(
        tokenIds.map((tokenId) =>
            nonfungiblePositionManagerContract.positions(tokenId),
        ),
    );

    return Promise.all(
        positions.map(async (position, index) => {
            const [token0, token1] = await Promise.all([
                getTokenFromAddress(position.token0),
                getTokenFromAddress(position.token1),
            ]);
            const fee = parseInt(position.fee);
            const pool = await getPoolFromAddress(
                await getPool(token0.address, token1.address, fee),
            );
            return {
                tokenId: parseInt(tokenIds[index]),
                pool: pool,
                tickLower: position.tickLower,
                tickUpper: position.tickUpper,
                priceLower: tickToPrice(
                    token0,
                    token1,
                    parseInt(position.tickLower),
                ).toSignificant(),
                priceUpper: tickToPrice(
                    token0,
                    token1,
                    parseInt(position.tickUpper),
                ).toSignificant(),
            };
        }),
    );
}
