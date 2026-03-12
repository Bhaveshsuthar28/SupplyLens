import { SignUp } from "@clerk/react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 py-8">
      <div className="flex flex-col items-center gap-5 w-full max-w-sm sm:max-w-none sm:w-auto">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">SupplyLens</h1>
          <p className="text-slate-400 mt-1 text-sm">Supplier Intelligence Platform</p>
        </div>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full sm:w-auto shadow-lg sm:shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden",
              card: "w-full bg-slate-800 border border-slate-700",
              headerTitle: "text-white",
              headerSubtitle: "text-slate-400",
              formFieldLabel: "text-slate-300",
              formFieldInput:
                "bg-slate-700 border-slate-600 text-white placeholder-slate-500 focus:border-blue-500",
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
              footerActionLink: "text-blue-400 hover:text-blue-300",
            },
          }}
        />
      </div>
    </div>
  );
}
