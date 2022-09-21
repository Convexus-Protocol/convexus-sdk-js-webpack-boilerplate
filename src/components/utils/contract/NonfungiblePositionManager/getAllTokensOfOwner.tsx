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

export async function getAllTokensOfOwner(user: string) {
    const count = parseInt(
        await nonfungiblePositionManagerContract.balanceOf(user),
    );

    const indexes = [...Array(count).keys()]; // range(count)

    // Get all token IDs owned by the user
    return Promise.all(
        indexes.map(async (index) =>
            parseInt(
                await nonfungiblePositionManagerContract.tokenOfOwnerByIndex(
                    user,
                    index,
                ),
            ),
        ),
    );
}
