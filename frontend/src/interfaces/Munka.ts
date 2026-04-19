import type { Feladat } from "./Feladat";
import type { User } from "./User";
import type { Eszkoz } from "./Eszkoz";

export interface MunkaUser {
    munka_id: number;
    user_id: number;
    user?: User;
}

export interface MunkaEszkoz {
    munka_id: number;
    eszkoz_id: number;
    eszkoz?: Eszkoz;
}

export interface Munka {
    munka_id: number;
    munka_neve: string;
    leiras: string;
    ertesitesIsActive: boolean;
    isActive: boolean;
    kezdeti_datum: string;
    varhato_befejezes_datuma: string;
    feladat?: Feladat[];
    munkaUsers?: MunkaUser[];
    munkaEszkozok?: MunkaEszkoz[];
}