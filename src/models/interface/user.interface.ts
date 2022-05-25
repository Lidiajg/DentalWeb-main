type Type = 'patient' | 'medic' | 'admin';
export interface User{
    uid: string;
    email: string;
    name: string;
    lastname: string;
    image: string;
    type: Type;
}