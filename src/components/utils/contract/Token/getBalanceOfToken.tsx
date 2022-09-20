import {Contract} from '@convexus/icon-toolkit';
import IIRC2 from '@src/artifacts/contracts/IRC2/IRC2.json';
import {CurrencyAmount, Token, Icx} from '@convexus/sdk-core';
import {iconService, debugService, networkId} from '../getProviders';

export async function getBalanceOfToken(
    token: Token,
    address: string,
): Promise<CurrencyAmount<Token>> {
    if (!Icx.isWrappedAddress(token.address)) {
        const contract = new Contract(
            token.address,
            IIRC2,
            iconService,
            debugService,
            networkId,
        );
        return contract.balanceOf(address).then((balance: string) => {
            return CurrencyAmount.fromRawAmount(token, balance);
        });
    } else {
        const balance = await iconService.getBalance(address).execute();
        return CurrencyAmount.fromRawAmount(
            new Icx().wrapped,
            balance.toString(10),
        );
    }
}
