

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (!res.ok) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      setAdmin(data.admin);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Exclure la page login du layout
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: '📊',
      show: admin.role === 'super_admin',
    },
    {
      name: 'Commandes',
      href: '/admin/orders',
      icon: '📦',
      show: true,
    },
    {
      name: 'Produits',
      href: '/admin/products',
      icon: '🛍️',
      show: admin.role === 'super_admin',
    },
    {
      name: 'Clients',
      href: '/admin/customers',
      icon: '👥',
      show: admin.role === 'super_admin',
    },
    {
      name: 'Administrateurs',
      href: '/admin/admins',
      icon: '👤',
      show: admin.role === 'super_admin',
    },
    {
      name: 'Paramètres',
      href: '/admin/settings',
      icon: '⚙️',
      show: true,
    },
  ].filter(item => item.show);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 w-64`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 px-3">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🛒</span>
              <span className="text-xl font-bold text-gray-900">Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* User Info */}
          <div className="mb-6 px-3 py-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{admin.name}</p>
            <p className="text-xs text-gray-500">{admin.email}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
              {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-4 left-3 right-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span className="mr-3 text-lg">🚪</span>
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'lg:ml-64' : ''} transition-all`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}



// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';

// interface Admin {
//   id: string;
//   name: string;
//   email: string;
//   role: 'super_admin' | 'admin';
// }

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [admin, setAdmin] = useState<Admin | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(true);


//   useEffect(() => {
//     let isMounted = true;

//     const checkAuth = async () => {
//       try {
//         console.log('🔍 Layout checking auth...');
        
//         const res = await fetch('/api/auth/me', {
//           credentials: 'include',
//           cache: 'no-store',
//         });

//         if (!isMounted) return;

//         if (!res.ok) {
//           console.log('❌ Auth failed, redirecting to login');
//           router.push('/admin/login');
//           return;
//         }

//         const data = await res.json();
//         console.log('✅ Auth success in layout:', data.admin.email);
//         setAdmin(data.admin);
//       } catch (error) {
//         console.error('❌ Auth check error:', error);
//         if (isMounted) {
//           router.push('/admin/login');
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     checkAuth();

//     return () => {
//       isMounted = false;
//     };
//   }, []); // ✅ Vide pour éviter les boucles

//   const handleLogout = async () => {
//     try {
//       await fetch('/api/auth/logout', {
//         method: 'POST',
//         credentials: 'include',
//       });
//       router.push('/admin/login');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!admin) {
//     return null;
//   }

//   const navigation = [
//     { name: 'Dashboard', href: '/admin', icon: '📊', show: true },
//     { name: 'Commandes', href: '/admin/orders', icon: '📦', show: true },
//     { name: 'Produits', href: '/admin/products', icon: '🛍️', show: admin.role === 'super_admin' },
//     { name: 'Clients', href: '/admin/customers', icon: '👥', show: admin.role === 'super_admin' },
//     { name: 'Administrateurs', href: '/admin/admins', icon: '👤', show: admin.role === 'super_admin' },
//     { name: 'Paramètres', href: '/admin/settings', icon: '⚙️', show: true },
//   ].filter(item => item.show);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <aside
//         className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } bg-white border-r border-gray-200 w-64`}
//       >
//         <div className="h-full px-3 py-4 overflow-y-auto">
//           <div className="flex items-center justify-between mb-8 px-3">
//             <div className="flex items-center">
//               <span className="text-2xl mr-2">🛒</span>
//               <span className="text-xl font-bold text-gray-900">Admin</span>
//             </div>
//           </div>

//           <div className="mb-6 px-3 py-3 bg-blue-50 rounded-lg">
//             <p className="text-sm font-medium text-gray-900">{admin.name}</p>
//             <p className="text-xs text-gray-500">{admin.email}</p>
//             <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded">
//               {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
//             </span>
//           </div>

//           <nav className="space-y-1">
//             {navigation.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
//                     isActive
//                       ? 'bg-blue-50 text-blue-700'
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   <span className="mr-3 text-lg">{item.icon}</span>
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </nav>

//           <div className="absolute bottom-4 left-3 right-3">
//             <button
//               onClick={handleLogout}
//               className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
//             >
//               <span className="mr-3 text-lg">🚪</span>
//               Déconnexion
//             </button>
//           </div>
//         </div>
//       </aside>

//       <div className={`${sidebarOpen ? 'lg:ml-64' : ''} transition-all`}>
//         <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
//           <div className="px-4 py-4 flex items-center justify-between">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//           </div>
//         </header>

//         <main className="p-6">{children}</main>
//       </div>
//     </div>
//   );
// }
