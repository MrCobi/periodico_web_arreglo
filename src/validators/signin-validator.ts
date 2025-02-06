import { input } from "framer-motion/client";
import * as v from "valibot";

export const SigninSchema = 
    v.object({
        email: v.pipe(
            v.string("Tu email debe ser un string"),
            v.nonEmpty("Por favor introduce tu email"),
            v.email("El email no es correcto")
        ),
        //password
        password: v.pipe(
            v.string("Tu contraseña debe ser un string"),
            v.nonEmpty("Por favor introduce tu contraseña"),
        ),
    })

export type SigninInput = v.InferInput<typeof SigninSchema>;