import { Photo } from "./photo";

export interface Member {
    id:number;
    username:string;
    photoUrl:string;
    age:number;
    knownAs:string;
    created:Date;
    LastActive:Date;
    gender:string;
    introduction:string;
    lookingFor:string;
    interests:string;
    city:string;
    country:string;
    photo:Photo[];
}