import React, {useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {PositionElement} from './PositionElement';
import {getPositionsInfo} from './getPositionsInfo';

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
