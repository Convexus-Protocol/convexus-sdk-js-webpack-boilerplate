import {NonfungiblePositionManager} from '@convexus/sdk';

export const DEFAULT_BOOKMARK = {
    cxfebfa753e6b8720eb027a92ea7c4d176e737cc4f: 'Factory',
    cx96c66d92281301df9e48dba14cce5ecbac25ad8b: 'BNUSD/ICX Pool',
    cx17c8cfede35b199a91d1705349b668c626c8e9e7: 'BNUSD/USDC Pool',
    cxf62cfd827aaf7e8b8d03efdd6e367eb97bdc0f44: 'USDC/ICX Pool',
    cx693cf32617c7ca8d592fd745cd6345777a9e2835: 'USDC/SICX Pool',
    cxde221cb38827f0de15bd223959115e48e40858b9: 'USDT/ICX Pool',
    cx52d41d4a5dc857d5f9817302e4208edb596dcd4d: 'WETH/CRV Pool',
    cx379f1ffc4e3d39108a7219c5752275ea7dd581e4: 'Swap Router',
    cxde577441b0e538da9bc2c080b05a5b3097675d94: 'Position Descriptor',
    cx63681ac43681f306c05298b715dcef57a9fbb18c: 'Position Manager',
    cxa6ac93e4b601dbde627e4b962c64a9bd574fd309: 'Pool ReadOnly',
    cxb30a8e7ec6688b8f2815432018a9dd3221df508d: 'Quoter',
    cx6abd1685c27f04f95e47f0200ee3597a182e0e9a: 'Pool Initializer',
    cx196276887ec398a1fb41b335f9260fbb300c684b: 'bnUSD',
    cxc8373f6f2654a9c8b689059aef58aefb9f878e12: 'CRV',
    cx26a0bf7574f0c7eff197beaed51736954a292f25: 'CTT',
    cx79ada8b605380c84507d42534080ada30c77602c: 'sICX',
    cxa818e190782c7bc64c1ec12512c7f8f3171fc8cf: 'USDC',
    cxa2895912e90f92e17c6df7e382c04745c7b6a9ce: 'USDT',
    cx1126c5dc7115daea7f55d6b6cf0eb63adeb3529f: 'WETH',
};

function getKeyByValue(object: any, value: any): string {
    const address = Object.keys(object).find((key) => object[key] === value);
    if (!address) {
        throw new Error(`Contract ${value} not found in bookmark`);
    }
    return address;
}

export function getAddressFromBookmark(name: string) {
    return getKeyByValue(DEFAULT_BOOKMARK, name);
}
