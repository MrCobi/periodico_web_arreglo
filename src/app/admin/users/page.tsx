// src/app/admin/users/page.tsx
'use server';
import prisma from "@/lib/db"
import Link from 'next/link';
import { auth } from "@/auth"

export default async function UsersPage() {
  const session = await auth();

  if (!session) {
    return <div>Not authenticated</div>
  }

  <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
  </div>

  const users = await prisma.user.findMany();

  return (
    <div className="text-center">
      <h1 className="text-5xl mb-5">Users</h1>
      <div className="overflow-x-auto flex justify-center">
        <table className="table-auto w-4/5 border-collapse border border-gray-300">
          <thead className="bg-zinc-700">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
          {users.map((user: any) => (
            <tr key={user.id} className="border">
              <td className="border px-4 py-2">{user.id}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.roleId}</td>
              <td className="border px-4 py-2">
                <Link href={`/admin/users/view/${user.id}`} className="text-blue-500 mr-2">Ver</Link>
                <Link href={`/admin/users/edit/${user.id}`} className="text-yellow-500 mr-2">Editar</Link>
                <Link href={`/admin/users/delete/${user.id}`} className="text-red-500">Eliminar</Link>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
      <div className="mt-5">
        <Link
          href="/admin/users/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600"
        >
          Añadir Usuario
        </Link>
      </div>
    </div>
  );
}
