import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from "@angular/material/snack-bar";
import { shareReplay } from "rxjs/operators";

@Injectable({
    providedIn: 'platform',
})
export class DataService {
    private _selectedBlock = {
        type: "fake",
        publicKey: "",
        hash: "",
        previousHash: "",
        nonce: 0,
        number: 0,
        signature: "",
        createdAt: "",
        payload: {
            transactions: [
                {
                    "data": {
                        "type": "fake"
                    },
                    "createdAt": "2021-12-13T19:02:49.882Z"
                },
                {
                    "data": {
                        "type": "fake"
                    },
                    "createdAt": "2021-12-13T19:02:49.882Z"
                },
                {
                    "data": {
                        "type": "fake"
                    },
                    "createdAt": "2021-12-13T19:02:49.882Z"
                },
            ],
        },
    };
    public set selectedBlock(value) {
        this._selectedBlock = value;
    }
    public get selectedBlock () {
        return this._selectedBlock;
    }

    public isConnected = false;
    public colorScheme = {
        domain: ['#BBBBBB'], // 5AA454
    };
    public blocks = [];
    public nodes = [{name: "me", publicKey: "--------FAKE KEY----------"}];
    public identities = [];
    public pendingTransactions = [];
    

    constructor(private http: HttpClient, private snackbar: MatSnackBar) {
        console.log('Initialized data service');
        this.createRandomBlocks();
        if (this.endpoint) {
            this.checkEndpoint();
            this.fetchNodeInfos(true);
        }
    }

    isLoading = false;
    isReloading = false;

    private set endpoint(value) {
        localStorage.setItem('endpoint', value);
    }
    private get endpoint() {
        return localStorage.getItem('endpoint') || "blockchain.vonrehberg.consulting:60001";
    }
    
    setEndpointAndCheck(endpoint: string) {
        this.endpoint = endpoint;
        return this.checkEndpoint();
    }

    isEndpointSetup = false;
    checkEndpoint() {
        this.isLoading = true;
        const subscription = this.checkEndpointBy(this.endpoint);
        subscription.subscribe((data: any) => {
            this.isEndpointSetup = data.isInitialized;
            this.isLoading = false;
        }, (error) => {
            this.isLoading = false;
            this.displayMessage('Could not check node');
        });
        return subscription;
    }

    checkEndpointBy(endpoint) {
        return this.http.get("https://blockchain-proxy.vonrehberg.consulting/isNodeSetup?endpoint=" + endpoint).pipe(shareReplay());
    }

    setupNode(username, password) {
        this.isLoading = true;
        const subscription = this.setupNodeBy(this.endpoint, username, password);
        subscription.subscribe((data: any) => {
            this.isEndpointSetup = true;
            this.isLoading = false;
        }, (error) => {
            this.isLoading = false;
            this.displayMessage('Could not setup node');
        });
        return subscription;
    }

    setupNodeBy(endpoint, username, password) {
        return this.http.get("https://blockchain-proxy.vonrehberg.consulting/setupNode?endpoint=" + endpoint, {headers: {authorization: 'Basic ' + btoa(username + ':' + password)}}).pipe(shareReplay());
    }

    createIdentity(name) {
        return this.http.post("https://blockchain-proxy.vonrehberg.consulting/createIdentity?endpoint=" + this.endpoint, {name}, {headers: {"content-type": "application/json"}}).pipe(shareReplay());
    }

    createTransaction(data) {
        return this.http.post("https://blockchain-proxy.vonrehberg.consulting/createTransaction?endpoint=" + this.endpoint, data, {headers: {"content-type": "application/json"}}).pipe(shareReplay());
    }

    joinNetwork(endpoint, username, password) {
        return this.http.post("https://blockchain-proxy.vonrehberg.consulting/joinNetwork?endpoint=" + endpoint, {endpoint: this.endpoint}, {headers: {"content-type": "application/json", authorization: 'Basic ' + btoa(username + ':' + password)}}).pipe(shareReplay());
    }

    fetchNodeInfos(keepRefreshing: boolean, reloading?: boolean) {
        if (reloading) {
            this.isReloading = true;
        } else {
            this.isLoading = true;
        }
        this.http.get("https://blockchain-proxy.vonrehberg.consulting/getBlocksPaginated?top=20&endpoint=" + this.endpoint).subscribe((data: any[]) => {
            this.isLoading = false;
            this.isReloading = false;
            this.isConnected = true;
            this.blocks = data.map((block) => {
                return {
                    name: "Block #" + block.number,
                    value: block.payload.transactions.length,
                    extra: block,
                };
            });
            this.blocks.sort((block1, block2) => block1.extra.number - block2.extra.number);
            while (this.blocks.length <= 20) {
                this.blocks.push({name: this.getEmptyName(this.blocks.length), value: 0});
            }
            this.colorScheme = {
                domain: ['#9ebedf'],
            };
            this.getNodes(keepRefreshing, reloading);
        }, (error) => {
            this.isLoading = false;
            this.isReloading = false;
            this.displayMessage('Could not retrieve blocks');
        });
    }

    private getNodes(keepRefreshing: boolean, reloading?: boolean) {
        if (reloading) {
            this.isReloading = true;
        } else {
            this.isLoading = true;
        }
        this.http.get("https://blockchain-proxy.vonrehberg.consulting/getNodes?endpoint=" + this.endpoint).subscribe((data: any[]) => {
            this.isLoading = false;
            this.isReloading = false;
            this.isConnected = true;
            this.nodes = data;
            this.getIdentities(keepRefreshing, reloading);
        }, (error) => {
            this.isLoading = false;
            this.isReloading = false;
            this.displayMessage('Could not retrieve nodes');
        });
    }

    private getIdentities(keepRefreshing: boolean, reloading?: boolean) {
        if (reloading) {
            this.isReloading = true;
        } else {
            this.isLoading = true;
        }
        this.http.get("https://blockchain-proxy.vonrehberg.consulting/getIdentities?endpoint=" + this.endpoint).subscribe((data: any[]) => {
            this.isLoading = false;
            this.isReloading = false;
            this.isConnected = true;
            this.identities = data;
            this.getPendingTransactions(keepRefreshing, reloading);
        }, (error) => {
            this.isLoading = false;
            this.isReloading = false;
            this.displayMessage('Could not retrieve nodes');
        });
    }

    private getPendingTransactions(keepRefreshing: boolean, reloading?: boolean) {
        if (reloading) {
            this.isReloading = true;
        } else {
            this.isLoading = true;
        }
        this.http.get("https://blockchain-proxy.vonrehberg.consulting/pendingTransactions?endpoint=" + this.endpoint).subscribe((data: any[]) => {
            this.isLoading = false;
            this.isReloading = false;
            this.isConnected = true;
            this.pendingTransactions = data;
            if (keepRefreshing) {
                setTimeout(() => {
                    this.fetchNodeInfos(true);
                }, 5000);
            }
        }, (error) => {
            this.isLoading = false;
            this.isReloading = false;
            this.displayMessage('Could not retrieve nodes');
        });
    }

    displayMessage(message) {
        this.snackbar.open(message, undefined, {duration: 10000})
    }

    createRandomBlocks() {
        for (let i = 1; i <= 20; i++) {
            this.blocks.push(
                {
                  "name": "Block #" + i,
                  "value": Math.round(Math.random() * 10) + 1
                });
        }
    }

    getEmptyName(length: number) {
        let result = "";
        while (result.length < length) {
            result += " ";
        }
        return result;
    }
}

export interface ConnectData {
    endpoint: string;
}

export interface NewIdentityData {
    name: string;
}

export interface NewTransactionData {
    data: any;
    author: string;
    signature: string;
}