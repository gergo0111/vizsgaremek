import type { Feladat } from "./Feladat";

export interface Munka {
    munka_id: number;
    munka_neve: string;
    eszkoz_id: number;
    user_id: number;
    ertesitesIsActive: boolean;
    isActive: boolean;
    kezdeti_datum: string;
    varhato_befejezes_datuma: string;
    feladat?: Feladat[];
}