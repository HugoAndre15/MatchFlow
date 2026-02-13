'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputForm from "../../components/form/inputForm";
import SubmitButtonForm from "../../components/form/SubmitButtonForm";
import { authService } from "@/services/authService";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.login(formData);
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center bg-gradient-to-br from-white-100 to-white-200">
        <div className="text-left items-start flex flex-col gap-16 w-1/2 h-full py-8 items-center justify-center">
            <form onSubmit={handleSubmit} className="min-w-1/2 flex flex-col items-start justify-center gap-8 mx-auto">
                <div className="">
                    <h1 className="text-3xl font-medium text-gray-900">
                        Bon retour parmi nous
                    </h1>
                    <h2 className="text-base font-medium text-gray-700">
                        Entrez vos informations pour vous connecter
                    </h2>
                </div>
                {error && <p className="text-red-500 text-sm w-full">{error}</p>}
                <div className="w-full flex flex-col items-start gap-4 pr-12">
                    <InputForm 
                        label="Email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <InputForm 
                        label="Mot de passe" 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <SubmitButtonForm 
                        label={loading ? "Connexion..." : "Connexion"}
                        disabled={loading}
                        type="submit"
                        colorClass="bg-green-500 hover:bg-green-600 focus:ring-green-400/20"
                    />
                    <div className="h-0.5 w-2/3 bg-gray-800 mx-auto my-4"></div>
                    <div>

                    </div>
                    <div className="text-sm mx-auto">
                        <p>Pas encore de compte ? <a className="text-blue-500 hover:text-blue-600" href="/register">S&apos;inscrire</a></p>
                    </div>
                </div>
            </form>
        </div>
        <div className="w-1/2 h-full">
            <img src="/assets/img/fond-stade-auth.jpg" alt="Description" className="rounded-l-[45px] object-cover object-left h-full w-full" />
        </div>
    </div>
  );
}