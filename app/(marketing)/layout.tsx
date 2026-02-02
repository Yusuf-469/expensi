import type { Metadata } from "next";
import Link from "next/link";
import { Wallet, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Expensi - Split bills without the drama",
  description: "The easiest way to split bills and track expenses with friends, roommates, and groups.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1D9C5A] flex items-center justify-center text-white">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Expensi</span>
            </Link>
            
            {/* Center Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="/#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Testimonials
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/login">
                <Button className="bg-[#1D9C5A] hover:bg-[#157A46]">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#1D9C5A] flex items-center justify-center text-white">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white">Expensi</span>
              </div>
              <p className="text-sm">
                Split bills without the drama. The easiest way to track expenses with friends.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
            © 2024 Expensi. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
