import React from "react";
import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import FleetPage from "./pages/FleetPage";
import CarDetailPage from "./pages/CarDetailPage";
import CreateCarPage from "./pages/CreateCarPage";
import TermsPage from "./pages/TermsPage";
import ContactPage from "./pages/ContactPage";
import Debug from "./pages/Debug";

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "hover:text-accent transition-colors",
          isActive ? "text-white" : "text-zinc-200",
        ].join(" ")
      }
      end
    >
      {children}
    </NavLink>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh relative">
      <header className="fixed top-0 inset-x-0 z-20 bg-transparent h-[76px]">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <NavLink to="/" className="font-semibold tracking-wide">
            LUX•RENT
          </NavLink>
          <nav className="flex gap-6 text-sm">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/fleet">Flotte</NavItem>
            <NavItem to="/create">Create</NavItem>
            <NavItem to="/terms">Konditionen</NavItem>
            <NavItem to="/contact">Kontakt</NavItem>
          </nav>
        </div>
      </header>

      <main className="mx-auto">{children}</main>

      <footer className="max-w-7xl mx-auto px-4 py-8 text-xs text-zinc-400">
        © {new Date().getFullYear()} LUX•RENT
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/fleet"
        element={
          <Layout>
            <FleetPage />
          </Layout>
        }
      />
      <Route
        path="/cars/:id"
        element={
          <Layout>
            <CarDetailPage />
          </Layout>
        }
      />
      <Route
        path="/create"
        element={
          <Layout>
            <CreateCarPage />
          </Layout>
        }
      />
      <Route
        path="/terms"
        element={
          <Layout>
            <TermsPage />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <ContactPage />
          </Layout>
        }
      />

      {import.meta.env.DEV ? (
        <Route
          path="/debug"
          element={
            <Layout>
              <Debug />
            </Layout>
          }
        />
      ) : null}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
