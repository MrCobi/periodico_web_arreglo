// app/api/auth/signup/page.tsx
import React from 'react';
import SignUpForm from './_components/signup-form';

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Sign Up</h1>
        <div className="h-1 bg-gray-200 mb-6"></div>
        
        {/* SignUpForm */}
        <SignUpForm />
      </div>
    </main>
  );
}