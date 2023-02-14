export {};
import { getAccessToken as getToken } from "@crypto-jambot/proxy-utils";
import { JAM_ETH_NODE_HTTPS, JAM_ETH_NODE_WS } from "./constants";
import Web3 from "web3";
import { Eth } from "web3-eth";
import { Utils } from "web3-utils";
const HttpProvider = Web3.providers.HttpProvider;
const WebsocketProvider = Web3.providers.WebsocketProvider;
let key: string;
let accessToken: string;
let web3: Web3;
let wsWeb3: Web3;

export interface UtilOptions {
    isWebsocket: boolean;
}
export class Web3Utils {
    constructor(apiKey: string) {
        key = apiKey;
    }

    async #init(): Promise<void> {
        await this.getAccessToken();
        initializeWeb3();
    }

    async getAccessToken(): Promise<string> {
        const { token } = await getToken(key);
        accessToken = token;
        return accessToken;
    }

    async getClient(options?: UtilOptions): Promise<Web3> {
        await this.#init();
        return options?.isWebsocket ? wsWeb3 : web3;
    }

    getUtilities(): Utils {
        return Web3.utils;
    }

    async getEthereum(options?: UtilOptions): Promise<Eth> {
        await this.#init();
        return options?.isWebsocket ? wsWeb3.eth : web3.eth;
    }
}

function initializeWeb3(): void {
    const options = {
        headers: [
            {
                name: "Authorization",
                value: `Bearer ${accessToken}`,
            },
        ],
    };
    web3 = new Web3(new HttpProvider(JAM_ETH_NODE_HTTPS, options));
    wsWeb3 = new Web3(new WebsocketProvider(JAM_ETH_NODE_WS, options));
}
