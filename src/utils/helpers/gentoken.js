import { TOKEN_EXP, ALGORITHM } from "@/config/constant";
import jwt from "jsonwebtoken";

const algorithm = ALGORITHM ? ALGORITHM : null;

export const genTokenp = (data, SECRET_KEY, EXP) => {
    const expiresIn = EXP || TOKEN_EXP;

    return jwt.sign(
        { email: data }, 
        SECRET_KEY,
        {
            ...(algorithm && { algorithm: algorithm }),
            expiresIn: expiresIn 
        }
    );
}
