import { getAccessToken as getToken } from "@crypto-jambot/proxy-utils";
import { JAM_ETH_NODE_HTTPS } from "./constants";
import Web3 from "web3";
import { Eth } from "web3-eth";
import { Utils } from "web3-utils";
import jam from "./types";
const HttpProvider = Web3.providers.HttpProvider;
let key: string;
let accessToken: string;
let web3: Web3;
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

    async getClient(): Promise<Web3> {
        await this.#init();
        return web3;
    }

    getUtilities(): Utils {
        return Web3.utils;
    }

    async getEthereum(): Promise<Eth> {
        await this.#init();
        return web3.eth;
    }
}

function initializeWeb3(): void {
    const options = {
        headers: [
            {
                name: "access-token",
                value: accessToken,
            },
        ],
    };
    web3 = new Web3(new HttpProvider(JAM_ETH_NODE_HTTPS, options));
}
