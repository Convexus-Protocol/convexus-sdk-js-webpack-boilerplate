import {factoryContract} from '../Factory/getContract';

export async function getPoolAddress(
    tokenA: string,
    tokenB: string,
    fee: number,
) {
    return factoryContract.getPool(tokenA, tokenB, fee);
}
