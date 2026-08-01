import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from '@clerk/ui/themes'
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({ subsets: ["latin "] })

export const metadata = {
  title: "Foody - AI Recipe Platform",
  description: "AI powered recipe helper for us",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        theme: neobrutalism,
      }}
    >
      <html
        lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`} suppressHydrationWarning>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Toaster richColors/>
          <footer className="py-8 px-4 border-t ">
            <div className="max-w-6xl mx-auto justify-center items-center">
              <p className="text-stone-500 text-sm ">
                Made with ❤️ by Ankush
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
