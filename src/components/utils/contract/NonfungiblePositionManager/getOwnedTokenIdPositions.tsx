import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {getAllTokensOfOwner} from '@src/components/utils/contract/NonfungiblePositionManager/getAllTokensOfOwner';
import {getPosition} from '@src/components/utils/contract/NonfungiblePositionManager/getPosition';

export function getOwnedTokenIdPositions() {
    const wallet = getUserWallet();

    // Read all tokenIds owned by user
    return getAllTokensOfOwner(wallet.getAddress()).then((tokenIds) => {
        // Get all positions associated by each token Id
        return Promise.all(
            tokenIds.map((tokenId) => getPosition(tokenId)),
        ).then((positions) => {
            // Associate tokenId:position
            return positions.map((position, index) => {
                return {
                    tokenId: tokenIds[index],
                    position: position,
                };
            });
        });
    });
}
