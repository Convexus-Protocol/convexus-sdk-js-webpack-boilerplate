export const DEFAULT_BOOKMARK = {
    cx0763c3b98532e7cf91dfb7623f73f4dfcaeed9b6: 'Factory',
    cx44482bb0484b74c1fcf0bd38e14b84c9695beeb0: 'BNUSD/ICX Pool',
    cxcdc92c3e1e4cd5e1b42d18b4ed920260fbdad8e0: 'BNUSD/USDC Pool',
    cx4c20a36e7f08c11ca2d7915832e5e27e17737e63: 'USDC/ICX Pool',
    cx2dcd3ac2b9bf8900858fe82586d4ddb24a1d6f13: 'USDC/SICX Pool',
    cx0a0a78f50cf7c700e12685ef6b447a9ed85820ea: 'USDT/ICX Pool',
    cxca9485a2cd986187b0f9be5f711c3def4887114a: 'WETH/CRV Pool',
    cx5aef04ae6e642363568664ecc8e20c6c8af54c9d: 'Swap Router',
    cx6a219333f69cf9d04539ce5442d17bebcbbfbaa7: 'Position Descriptor',
    cx87c9d4c8e94031ebd178e5ffa556bdf1390bfd11: 'Position Manager',
    cx94e27f8985787821ee3f5ff0d9ca8004cdce911a: 'Pool ReadOnly',
    cxf1edbb5ce83dd8a902e64adb7fc073b20632a6c6: 'Quoter',
    cx18e3ef0e6a431023cee24c9458bcdbd0bc21bb0b: 'Pool Initializer',
    cx43f9902890ce7ff01a4cda809337bdadc5dcf849: 'bnUSD',
    cxbe96f040991bf22cc2df7d96ce757768ecd9860d: 'sICX',
    cx71698bfaa0fc2c8929c226c52611ba033eaafc76: 'USDC',
    cx1727da573c78098f1b7cd6e01ae11a3da935d2e1: 'USDT',
    cx4892e2825f7a4f95ef6c69f2a5456745d28a551a: 'CRV',
    cxb9d8730b23a6fa319bdfa3d5162606c2039c5156: 'WETH',
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
