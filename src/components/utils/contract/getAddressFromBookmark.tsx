export const DEFAULT_BOOKMARK = {
    cx1aba3317236dea6d8848bc42cf86b01062a39b6b: 'Factory',
    cx1ee42aaa2e4ce922cdd8172becae951eef2a7920: 'BNUSD/ICX Pool',
    cxcc48f601776b5998625017c7d220d09a150aa2ad: 'BNUSD/USDC Pool',
    cx4f61a0912d7306b1cb224bb60af05d58e03fa16b: 'USDC/ICX Pool',
    cx3b0b7be28a2285e87f6b00d5fd91f0d34316397f: 'USDC/SICX Pool',
    cxc914f7d782bce213624d73125d973bde12c838ea: 'USDT/ICX Pool',
    cx504c9900b3964dacbbdb3daaedbcc8e0cc070f94: 'WETH/CRV Pool',
    cx70a59c0d1f1f44de6b03b5d434585495be896c23: 'Swap Router',
    cxb5eba4af6b21b0a28a52aee941436d858a2dce72: 'Position Descriptor',
    cxfe235d680e2d5fc627bef81aba66333117b05f1b: 'Position Manager',
    cx18fa790db537fe89cb57b27347d56506dade7ff4: 'Pool ReadOnly',
    cxb9ad361584601050482206dd3da76b578dfdec31: 'Quoter',
    cxc5d471b87124f00dc7710402f56cb798c77264a3: 'Pool Initializer',
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
