
import { RowDataPacket } from "mysql2";
export default interface User extends RowDataPacket {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}