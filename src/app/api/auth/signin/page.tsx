import SigninForm from "./_components/signin-form";

export default function SignInPage() {
  return (
  <main className="mt-4">
    <div className="container">
      <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
      <div className="h-1 bg-muted my-4"/>
    {/* SignInForm */}
      <SigninForm />
     

    </div>
    </main>
  );
}
