import Link from "next/link";
import { FC, ReactNode } from "react";

interface LayoutProps {
  children?: ReactNode;
}

export const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <nav className="navbar text-[#003082]">
        <div className="flex-1">
          <span className="btn btn-ghost normal-case text-xl">
            NS Github Search
          </span>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/">Search</Link>
            </li>
            <li>
              <Link href="/history">History</Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="p-16 bg-gradient-to-br to-white from-blue-100 min-h-screen">
        {children}
      </main>
    </>
  );
};
