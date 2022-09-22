import {factoryContract} from '@src/components/utils/contract/Factory/getContract';
import {getNameContract} from '@src/components/utils/contract/Name/getContract';

export async function getFactoryPools() {
    const poolsSize = parseInt(await factoryContract.poolsSize());
    const indexes = [...Array(poolsSize).keys()]; // range(poolsSize)
    const poolsAddresses = await Promise.all(
        indexes.map((index) => factoryContract.pools(index)),
    );
    const poolsNames = await Promise.all(
        poolsAddresses.map((poolAddress) => {
            const poolContract = getNameContract(poolAddress);
            return poolContract.name();
        }),
    );

    return poolsAddresses.map((poolAddress, i) => {
        return {address: poolAddress, name: poolsNames[i]};
    });
}
