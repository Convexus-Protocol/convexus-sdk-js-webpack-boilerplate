import React from 'react';

export function TxHashLink({txHash}: any) {
    return (
        <a href={'https://tracker.berlin.icon.community/transaction/' + txHash}>
            {txHash}
        </a>
    );
}
