export interface Munka {
    munka_id: number;
    munka_neve: string;
    eszkoz_id: number;
    user_id: number;
    ertesitesIsActive: boolean;
    isActive: boolean;
    kezdeti_datum: Date;
    varhato_befejezes_datuma: Date;
}