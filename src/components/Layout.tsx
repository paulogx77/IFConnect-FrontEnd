"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      setUsuario(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    router.push("/login");
  };

  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/feed" className="text-xl font-bold text-green-600">
              IFConnect
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/feed" 
                className={`px-3 py-2 rounded-md ${
                  pathname === "/feed" ? "bg-green-100 text-green-700" : "text-gray-600"
                }`}
              >
                Feed
              </Link>
              <Link 
                href="/perfil" 
                className={`px-3 py-2 rounded-md ${
                  pathname === "/perfil" ? "bg-green-100 text-green-700" : "text-gray-600"
                }`}
              >
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}