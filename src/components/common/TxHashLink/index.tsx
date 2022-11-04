import React from 'react';

export function TxHashLink({txHash}: any) {
    return (
        <>
            &nbsp;
            <a
                href={
                    'https://tracker.lisbon.icon.community/transaction/' +
                    txHash
                }
            >
                {txHash}
            </a>
        </>
    );
}
