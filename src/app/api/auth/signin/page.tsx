import SigninForm from "./_components/signin-form";

export default async function SignInPage(
  props:{
    searchParams: Promise<{verified: string}>
  }
) {
  const searchParams = await props.searchParams;
  const isVerified = searchParams.verified === "true";
  return (
  <main className="mt-4">
    <div className="container">
      <h1 className="text-3xl font-bold tracking-tight">Sign In</h1>
      <div className="h-1 bg-muted my-4"/>
      {
        isVerified && (
        <p className="text-success">Email verified</p>
      )}
    {/* SignInForm */}
      <SigninForm isVerified={isVerified}/>
     

    </div>
    </main>
  );
}
