import jwt from 'jsonwebtoken';

export const generateTokenForClient = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_CLIENT as string, {
        expiresIn: "14d"
    })
}

export const generateTokenForFlowider = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_FLOWIDER as string, {
        expiresIn: "14d"
    })
}

