import {validateAndParseAddress} from '@convexus/icon-toolkit';
import React from 'react';
import * as styles from './styles.module.less';

export function ParseResult({address}: any) {
    let result;

    try {
        validateAndParseAddress(address);
        result = true;
    } catch (e) {
        result = false;
    }

    return result ? (
        <span className={styles.ok}>OK</span>
    ) : (
        <span className={styles.error}>Error</span>
    );
}
