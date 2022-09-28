import {Contract} from '@convexus/icon-toolkit';

export async function getPoolState(poolContract: Contract) {
    const [liquidity, slot0] = await Promise.all([
        poolContract.liquidity(),
        poolContract.slot0(),
    ]);

    return {
        liquidity,
        sqrtPriceX96: slot0.sqrtPriceX96,
        tick: parseInt(slot0.tick, 16),
        observationIndex: slot0.observationIndex,
        observationCardinality: slot0.observationCardinality,
        observationCardinalityNext: slot0.observationCardinalityNext,
        feeProtocol: slot0.feeProtocol,
        unlocked: slot0.unlocked,
    };
}
