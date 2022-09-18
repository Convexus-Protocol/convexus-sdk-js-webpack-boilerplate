import React from 'react';
import {ParseResult} from './utils/ParseResult';
import * as appStyles from '@components/app/app.module.less';
import {ModuleHeader} from '@components/utils/ModuleHeader';

const validAddress = 'hx0123456789012345678901234567890123456789';
const invalidAddress = 'hx01234567890';

export const ModuleValidateAndParseAddress = () => (
    <div className={appStyles.module} id="ModuleValidateAndParseAddress">
        <ModuleHeader
            text={'Validate an Address'}
            name={'validateAndParseAddress'}
            link="https://github.com/Convexus-Protocol/convexus-sdk-js-webpack-boilerplate/blob/main/src/components/modules/createAndInitializePoolIfNecessary/ModuleCreateAndInitializePoolIfNecessary.tsx"
        />
        <div>
            <p>Valid address: {validAddress}</p>
            <p>
                Result: <ParseResult address={validAddress} />
            </p>
        </div>

        <div>
            <p>Invalid address: {invalidAddress}</p>
            <p>
                Result: <ParseResult address={invalidAddress} />
            </p>
        </div>
    </div>
);
