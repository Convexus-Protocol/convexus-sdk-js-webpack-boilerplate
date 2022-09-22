import {nonfungiblePositionManagerContract} from './getContract';

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
