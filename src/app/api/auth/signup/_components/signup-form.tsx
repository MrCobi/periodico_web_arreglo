"use client"

import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from 'zod';
import { SignUpSchema } from '@/lib/zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { registerAction } from '@/actions/auth-action';
import { useState, useTransition } from "react";
import { useRouter } from 'next/navigation';


export default function SignupForm() {

    const [error,setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

     const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
          email: "",
          password: "",
          name: "",
        },
      })




    async function onSubmit(values: z.infer<typeof SignUpSchema>) {
      setError(null);
      startTransition(async() => {
        const response = await registerAction(values);


        if (response.error) {
          setError(response.error);
        } else{
         // router.push("../../../../dashboard");
        }
      })
      }

    return (
        <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-[400px] w-full mx-auto p-8 bg-white shadow-lg rounded-lg border border-gray-200"
          autoComplete="off"
        >
          {/* Campo de Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="e.g. PabloHervas@ejemplo.com"
                    {...field}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
            )}
          />
      
          {/* Campo de Contraseña */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Contraseña</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="e.g. *****"
                    {...field}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
  
            )}

            
          />

<FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Nombre</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="e.g. *****"
                    {...field}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm" />
              </FormItem>
  
            )}

            
          />
          {
            error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )
          }
      
          {/* Botón de Iniciar Sesión */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isPending}
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </div>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>
      </Form>
    );

};


