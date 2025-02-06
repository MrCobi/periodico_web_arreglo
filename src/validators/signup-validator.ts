import { input } from "framer-motion/client";
import * as v from "valibot";

export const SignupSchema = v.pipe(
    v.object({
        name: v.pipe(
            v.string("Tu nombre debe ser un string"),
            v.nonEmpty("Por favor introduce tu nombre"),
            v.minLength(2, "El nombre debe tener al menos 2 caracteres"),
        ),
        email: v.pipe(
            v.string("Tu email debe ser un string"),
            v.nonEmpty("Por favor introduce tu email"),
            v.email("El email no es correcto")
        ),
        //password
        password: v.pipe(
            v.string("Tu contraseña debe ser un string"),
            v.nonEmpty("Por favor introduce tu contraseña"),
            v.minLength(6, "La contraseña debe tener al menos 6 caracteres")
        ),
        //password confirmation
        passwordConfirmation: v.pipe(
            v.string("Tu contraseña debe ser un string"),
            v.nonEmpty("Por confirme tu contraseña"),
        )
    }),
    v.forward(
        v.partialCheck(
            [["password"], ["passwordConfirmation"]],
            (input) => input.password === input.passwordConfirmation,
            "Las contraseñas no coinciden",
        ),
        ["passwordConfirmation"]
    )
);

export type SignupInput = v.InferInput<typeof SignupSchema>;