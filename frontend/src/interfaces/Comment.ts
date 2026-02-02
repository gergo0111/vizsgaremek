export interface Comment {
    comment_id: number;
    user_id: number;
    munka_id: number;
    uzenet: string;
    kuldesi_ido: Date;
    delete: boolean;
    isActive: boolean;
}