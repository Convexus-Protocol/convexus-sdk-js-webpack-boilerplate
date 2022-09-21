import React, {useEffect, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {TokenIdPosition} from '@src/components/common/TokenIdPosition';
import {getOwnedTokenIdPositions} from './getOwnedTokenIdPositions';

export const ModuleListOfPositions = () => {
    const [tokenIdPositions, setTokenIdPositions] = useState<any>();

    useEffect(() => {
        getOwnedTokenIdPositions().then((tokenIdPositions) =>
            setTokenIdPositions(tokenIdPositions),
        );
    }, []);

    return (
        <div className={appStyles.module} id="ModuleListOfPositions">
            <ModuleHeader
                text={'List of opened positions'}
                name={'ModuleListOfPositions'}
            />

            {tokenIdPositions &&
                tokenIdPositions.map((position: any, key: number) => (
                    <TokenIdPosition
                        key={key}
                        tokenId={position.tokenId}
                        position={position.position}
                    />
                ))}
        </div>
    );
};
