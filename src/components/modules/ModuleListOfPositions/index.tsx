import React, {useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import * as styles from './styles.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';
import {Contract} from '@convexus/icon-toolkit';
import INonfungiblePositionManager from '@src/artifacts/contracts/NonfungiblePositionManager/NonfungiblePositionManager.json';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {getUserWallet} from '@src/components/utils/contract/getUserWallet';
import {getTokenFromAddress} from '@src/components/utils/contract/Token/getTokenFromAddress';
import {tickToPrice} from '@convexus/sdk';
import {getPool} from '@src/components/utils/contract/ConvexusFactory/getPool';
import {getPoolFromAddress} from '@src/components/utils/contract/ConvexusPool/getPoolFromAddress';

export const nonfungiblePositionManagerAddress =
    getAddressFromBookmark('Position Manager');

export const nonfungiblePositionManagerContract = new Contract(
    nonfungiblePositionManagerAddress,
    INonfungiblePositionManager,
    iconService,
    debugService,
    networkId,
);

const getPositionsInfo = async () => {
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
        positions.map(async (position) => {
            const [token0, token1] = await Promise.all([
                getTokenFromAddress(position.token0),
                getTokenFromAddress(position.token1),
            ]);
            const fee = parseInt(position.fee);
            const pool = await getPoolFromAddress(
                await getPool(token0.address, token1.address, fee),
            );
            return {
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
};

export const ModuleListOfPositions = () => {
    const [positions, setPositions] = useState<any>();

    !positions &&
        getPositionsInfo().then((positions) => {
            setPositions(positions);
        });

    return (
        <div className={appStyles.module} id="ModuleListOfPositions">
            <ModuleHeader
                text={'List of opened positions'}
                name={'ModuleListOfPositions'}
            />

            {positions &&
                positions.map((position: any, key: number) => (
                    <PositionElement key={key} position={position} />
                ))}
        </div>
    );
};

function PositionElement({position}: any) {
    const inRange =
        position.pool.tickCurrent >= position.tickLower &&
        position.pool.tickCurrent <= position.tickUpper;
    return (
        <div className={styles.position}>
            <div className={styles.positionToken}>
                {position.pool.token0.symbol} / {position.pool.token1.symbol} (
                {position.pool.fee / 10000}%)
            </div>

            <div className={styles.positionPrice}>
                Min: {position.priceLower} - Max: {position.priceUpper}
            </div>

            <div className={styles.positionRange}>
                {inRange ? <InRange /> : <OutOfRange />}
            </div>
        </div>
    );
}

const InRange = () => <div className={styles.positionInRange}>In range</div>;

const OutOfRange = () => (
    <div className={styles.positionOutOfRange}>Out of range</div>
);
