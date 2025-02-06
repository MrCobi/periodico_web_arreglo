'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';


export default function Login() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailElement = document.getElementById('email') as HTMLInputElement;
    const passwordElement = document.getElementById(
      'password'
    ) as HTMLInputElement;
    const result = await signIn('credentials', {
      redirect: false,
      email: emailElement.value,
      password: passwordElement.value,
    });
    if (!result) return;
    if (result.error || !result.ok || result.status != 200) {
      return setError('Email o contraseña incorrectos');
    }
    setOk(true);
    const callbackUrl = searchParams.get('callbackUrl');
    router.push(callbackUrl ?? '/');
  };

  return (
    <div className="flex flex-col justify-center items-center relative login">
      <h1 className="text-3xl text-white font-bold mb-4">Bienvenido</h1>
      <form
        className="max-w-md w-full mx-auto p-6 grainy shadow-md rounded-xl border border-white border-opacity-50 relative"
        onSubmit={handleLogin}
      >
        <div className="mb-4">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="shadow appearance-none w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-transparent"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-white text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="shadow appearance-none w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline bg-transparent"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="basis-1 z-30 hover:shadow-2xl bg-rosa w-fit hover:bg-white hover:text-black transition-all duration-100 text-white rounded-full text-nowrap py-3 px-8 cursor-pointer font-bold mx-auto"
            type="submit"
          >
            LogIn
          </button>
        </div>
        {ok && (
          <div className="flex w-full justify-center align-center absolute -bottom-28 left-0">
            <div className=" text-white p-2 rounded  text-center">
              <p>Sesión iniciada correctamente</p>
              <a
                className="bg-white text-black rounded-full py-2 px-4 inline-block mt-3"
                href={searchParams.get('callbackUrl') ?? '/'}
              >
                Click para continuar
              </a>
            </div>
          </div>
        )}
        {error && (
          <div className="flex w-full justify-center align-center absolute -bottom-14 left-0">
            <div className="bg-rosa text-white p-2 rounded ">{error}</div>
          </div>
        )}
      </form>
    </div>
  );
}
