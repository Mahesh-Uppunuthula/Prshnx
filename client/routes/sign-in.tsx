import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/sign-in")({
  component: SignIn,
});

function SignIn() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Left Panel: Visual/Branding */}
      <div className="relative hidden lg:flex flex-col items-center justify-center p-12 bg-slate-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-75" />

        <div className="relative z-10 max-w-lg text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
              <Sparkles className="text-white w-8 h-8" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
              Unlock your best work
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed">
              Join thousands of creators building beautiful forms and
              unforgettable user experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 gap-4 text-left"
          >
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3 text-indigo-400">
                <Zap size={18} fill="currentColor" />
              </div>
              <h3 className="font-semibold text-white">Lightning Fast</h3>
              <p className="text-sm text-slate-400 mt-1">
                Build in minutes, not hours
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 text-purple-400">
                <Sparkles size={18} fill="currentColor" />
              </div>
              <h3 className="font-semibold text-white">Premium Design</h3>
              <p className="text-sm text-slate-400 mt-1">
                Polished out of the box
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Auth Actions */}
      <div className="relative flex flex-col items-center justify-center p-8 lg:p-24 bg-white">
        <div className="absolute top-6 right-6 lg:top-12 lg:right-12">
          <Button variant="ghost" asChild className="text-slate-600">
            <Link to="/">Go Home</Link>
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm space-y-10"
        >
          <div className="space-y-3 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </h1>
            <p className="text-slate-500 text-lg">
              Sign in to manage your account or create a new one to get started.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full h-14 text-base bg-slate-900 hover:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-all group"
              asChild
            >
              <a href="/api/auth/login">
                Sign In
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 text-base border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all"
              asChild
            >
              <a href="/api/auth/register">Create an account</a>
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium tracking-wide">
                Secured by Kinde
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-slate-400 max-w-xs mx-auto">
            By continuing, you agree to our{" "}
            <Link
              to="/"
              className="underline underline-offset-4 hover:text-slate-900"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/"
              className="underline underline-offset-4 hover:text-slate-900"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// function SignIn() {
//   return (
//     <div className="container relative h-[800px] min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
//       {/* Login Button (Mobile only potentially, or redundant if we have the form) - hiding for cleaner layout since we have the form right there. */}

//       {/* Right Actions (Top) */}
//       <div className="absolute right-4 top-4 md:right-8 md:top-8">
//         <Button variant="ghost" asChild>
//           <Link to="/">Go Home</Link>
//         </Button>
//       </div>

//       {/* Left Panel: Branding & Testimonial */}
//       <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
//         <div className="absolute inset-0 bg-zinc-900" />
//         <div className="relative z-20 flex items-center text-lg font-medium">
//           <Command className="mr-2 h-6 w-6" />
//           Prashnio
//         </div>
//         <div className="relative z-20 mt-auto">
//           <blockquote className="space-y-2">
//             <p className="text-lg">
//               &ldquo;This library has saved me countless hours of work and
//               helped me deliver stunning designs to my clients faster than ever
//               before.&rdquo;
//             </p>
//             <footer className="text-sm">Sofia Davis</footer>
//           </blockquote>
//         </div>
//       </div>

//       {/* Right Panel: Login Form */}
//       <div className="lg:p-8">
//         <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
//           <div className="flex flex-col space-y-2 text-center">
//             <h1 className="text-2xl font-semibold tracking-tight">
//               Create an account
//             </h1>
//             <p className="text-muted-foreground text-sm">
//               Enter your email below to create your account
//             </p>
//           </div>

//           <div className="grid gap-6">
//             <form>
//               <div className="grid gap-2">
//                 {/* Mocking a form structure but using the single Kinde button as requested */}
//                 <div className="grid gap-1">
//                   {/* We could add inputs here if it was a real form, but for Kinde generic login we use the button */}
//                 </div>
//                 <Button className="w-full" size="lg" asChild>
//                    <Link to="/sign-in">
//                     Sign In with Email
//                     <ArrowRight className="ml-2 size-4" />
//                   </Link>
//                 </Button>
//               </div>
//             </form>

//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-background px-2 text-muted-foreground">
//                   Or continue with
//                 </span>
//               </div>
//             </div>

//             <Button variant="outline" type="button" disabled>
//               {/* Disabled for now as we just want the main Kinde flow */}
//               <ShieldCheck className="mr-2 h-4 w-4" />
//               SSO (Coming Soon)
//             </Button>
//           </div>

//           <p className="text-muted-foreground px-8 text-center text-sm">
//             By clicking continue, you agree to our{" "}
//             <Link
//               to="/"
//               className="underline underline-offset-4 hover:text-primary"
//             >
//               Terms of Service
//             </Link>{" "}
//             and{" "}
//             <Link
//               to="/"
//               className="underline underline-offset-4 hover:text-primary"
//             >
//               Privacy Policy
//             </Link>
//             .
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
