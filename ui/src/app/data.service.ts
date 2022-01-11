import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from "@angular/material/snack-bar";

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
    

    constructor(private http: HttpClient, private snackbar: MatSnackBar) {
        console.log('Initialized data service');
        this.createRandomBlocks();
        if (this.endpoint) {
            this.checkEndpoint();
            this.fetchNodeInfos();
        }
    }

    isLoading = false;
    isReloading = false;

    private set endpoint(value) {
        localStorage.setItem('endpoint', value);
    }
    private get endpoint() {
        return localStorage.getItem('endpoint');
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
        return this.http.get("http://" + endpoint + "/webhook/isNodeSetup")
    }

    setupNode() {
        this.isLoading = true;
        const subscription = this.setupNodeBy(this.endpoint);
        subscription.subscribe((data: any) => {
            this.isEndpointSetup = true;
            this.isLoading = false;
        }, (error) => {
            this.isLoading = false;
            this.displayMessage('Could not setup node');
        });
        return subscription;
    }

    setupNodeBy(endpoint) {
        return this.http.get("http://" + endpoint + "/webhook/setupNode");
    }

    createIdentity(name) {
        return this.http.post("http://" + this.endpoint + "/webhook/createIdentity", {name}, {headers: {"content-type": "application/json"}});
    }

    createTransaction(data) {
        return this.http.post("http://" + this.endpoint + "/webhook/createTransaction", data, {headers: {"content-type": "application/json"}});
    }

    joinNetwork(endpoint) {
        return this.http.post("http://" + this.endpoint + "/webhook/joinNetwork", {endpoint: endpoint}, {headers: {"content-type": "application/json"}});
    }

    fetchNodeInfos(reloading?: boolean) {
        if (reloading) {
            this.isReloading = true;
        } else {
            this.isLoading = true;
        }
        this.http.get("http://" + this.endpoint + "/webhook/getBlocksPaginated?top=20").subscribe((data: any[]) => {
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
            this.getNodes(reloading);
        }, (error) => {
            this.isLoading = false;
            this.isReloading = false;
            this.displayMessage('Could not retrieve blocks');
        });
    }

    private getNodes(reloading?: boolean) {
        if (reloading) {
            this.isReloading = true;
        } else {
            this.isLoading = true;
        }
        this.http.get("http://" + this.endpoint + "/webhook/getNodes").subscribe((data: any[]) => {
            this.isLoading = false;
            this.isReloading = false;
            this.isConnected = true;
            this.nodes = data;
            this.getIdentities(reloading);
        }, (error) => {
            this.isLoading = false;
            this.isReloading = false;
            this.displayMessage('Could not retrieve nodes');
        });
    }

    private getIdentities(reloading?: boolean) {
        if (reloading) {
            this.isReloading = true;
        } else {
            this.isLoading = true;
        }
        this.http.get("http://" + this.endpoint + "/webhook/getIdentities").subscribe((data: any[]) => {
            this.isLoading = false;
            this.isReloading = false;
            this.isConnected = true;
            this.identities = data;
            setTimeout(() => {
                this.fetchNodeInfos(true);
            }, 5000);
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