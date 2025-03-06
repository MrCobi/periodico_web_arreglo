import prisma from "@/lib/db";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
        return new Response('Token no proporcionado', { status: 400 })
    }

    //verificar token
    const verifyToken = await prisma.verificationToken.findFirst({
        where: {
            token
        }
    })

    if (!verifyToken) {
        return new Response('Token no proporcionado', { status: 400 })
    }

    //verificar si el token ya ha expirado
    if (verifyToken.expires < new Date()) {
        return new Response('Token expirado', { status: 400 })
    }

    // verificar si el email ya esta verificado
    const user = await prisma.user.findUnique({
        where: {
            email: verifyToken.identifier,
        },
    });

    if (user?.emailVerified) {
        return new Response('Email ya verificado', { status: 400 })
    }

    //marcar email como verificado
    await prisma.user.update({
        where: {
            email: verifyToken.identifier
        },
        data: {
            emailVerified: new Date()
        }
    });

    //eliminar el token
    // Eliminar el token usando la clave única compuesta
    await prisma.verificationToken.delete({
        where: {
            identifier_token: {
                identifier: verifyToken.identifier,
                token: verifyToken.token,
            },
        },
    });


    //return response.json ({token})
    redirect("/api/auth/signin?verified=true");

}