export const DEFAULT_BOOKMARK = {
    cxa5fef4aae08b9ce90a32016d95d27bc51a505691: 'Factory',
    cx6118e10b98ffc44a1734f7ef8f19ffc6408742bd: 'BNUSD/ICX Pool',
    cxfe4b00c7247dcdffa9ff0f69aab6410e77ce0b12: 'BNUSD/USDC Pool',
    cxca1006106791f2168425faf4894443a15e56055a: 'USDC/ICX Pool',
    cx490bcd590c8ef306434313701b93d24af9da920f: 'USDC/SICX Pool',
    cx4e3b7a8e979c1c5228bf6a050932f826494a3ef6: 'USDT/ICX Pool',
    cxdf1d421d423ca31fa0ba542bf4e35ea27c4d8c44: 'WETH/CRV Pool',
    cx4f34b2771220d08f48968e30956e791a4f2242ec: 'Swap Router',
    cx6b4c84ce072eb6a654c34f99135ebc15c10686a7: 'Position Descriptor',
    cx7efd06272063ce2658c108d424888b15a9ca8a36: 'Position Manager',
    cx6843231a16b330a2ffd252ec7b7201a2d6815050: 'Pool ReadOnly',
    cxf2f4dde130bae77ea1fd264a7c8b1fef220e186b: 'Quoter',
    cx8d3bf56ea8d612a2f8ec277e8cc20a68611841a0: 'Pool Initializer',
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
