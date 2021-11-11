import {Address4} from 'ip-address'

export interface Hop {
    hop: number;

    ip: Address4;

    time: string;
}

export interface Destination {
    ip: Address4;
}