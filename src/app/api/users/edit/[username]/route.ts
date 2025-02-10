import { NextResponse } from 'next/server';

export async function PUT(req: Request, { params }: { params: { username: string } }) {
  try {
    const data = await req.json();
    console.log(`Actualizando usuario ${params.username} con datos:`, data);

    return NextResponse.json({ message: `Usuario ${params.username} actualizado correctamente` });
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}
