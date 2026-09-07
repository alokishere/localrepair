import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    const stored = JSON.parse(localStorage.getItem("localrepair_user") || "{}");
    return (
      <Navigate
        to={
          stored.role === "TECHNICIAN"
            ? "/technician/dashboard"
            : "/customer/dashboard"
        }
        replace
      />
    );
  }

  const update = (field) => (event) =>
    setForm({ ...form, [field]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (isRegister && form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const currentUser = isRegister
        ? await register({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          })
        : await login({ email: form.email, password: form.password });
      navigate(
        currentUser.role === "TECHNICIAN"
          ? "/technician/dashboard"
          : "/customer/dashboard",
      );
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to complete the request",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="section-container mx-auto max-w-lg px-6 py-12 sm:py-16">
      <h1 className="text-3xl font-bold" style={{ lineHeight: 1.2 }}>
        {isRegister ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-[var(--color-ink-secondary)]">
        {isRegister
          ? "Connect with trusted local repair help."
          : "Sign in to continue to LocalRepair."}
      </p>
      <form onSubmit={submit} className="card mt-8 space-y-5">
        {isRegister && (
          <label className="block text-sm font-medium text-[var(--color-ink)]">
            Name
            <input
              required
              minLength="2"
              maxLength="100"
              value={form.name}
              onChange={update("name")}
              className="input mt-2"
            />
          </label>
        )}
        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Email
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className="input mt-2"
          />
        </label>
        <label className="block text-sm font-medium text-[var(--color-ink)]">
          Password
          <input
            required
            minLength="8"
            type="password"
            value={form.password}
            onChange={update("password")}
            className="input mt-2"
          />
        </label>
        {isRegister && (
          <>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Confirm password
              <input
                required
                minLength="8"
                type="password"
                value={form.confirmPassword}
                onChange={update("confirmPassword")}
                className="input mt-2"
              />
            </label>
            <label className="block text-sm font-medium text-[var(--color-ink)]">
              Account type
              <select
                value={form.role}
                onChange={update("role")}
                className="input mt-2 appearance-none"
              >
                <option value="CUSTOMER">Customer</option>
                <option value="TECHNICIAN">Technician</option>
              </select>
            </label>
          </>
        )}
        {error && (
          <div
            className="rounded-[var(--radius-sm)] bg-[var(--color-danger-light)] p-3 text-sm text-[var(--color-danger)]"
            role="alert"
          >
            {error}
          </div>
        )}
        <button disabled={loading} className="btn-primary w-full">
          {loading
            ? "Please wait..."
            : isRegister
              ? "Create account"
              : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--color-ink-secondary)]">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <Link
          to={isRegister ? "/login" : "/register"}
          className="font-semibold text-[var(--color-primary)] hover:underline"
        >
          {isRegister ? "Sign in" : "Get started"}
        </Link>
      </p>
    </main>
  );
}
