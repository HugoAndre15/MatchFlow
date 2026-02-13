'use client';

import { useState } from "react";
import InputForm from "../../components/form/inputForm";
import CheckboxForm from "../../components/form/CheckboxForm";
import SubmitButtonForm from "../../components/form/SubmitButtonForm";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.register(formData);
            // Redirection après succès
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
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
                        Commencez dès maintenant
                    </h1>
                    <h2 className="text-base font-medium text-gray-700">
                        Entrez vos informations pour créer votre compte
                    </h2>
                </div>
                {error && <p className="text-red-500 text-sm w-full">{error}</p>}
                <div className="w-full flex flex-col items-start gap-4 pr-20">
                    <InputForm 
                        label="Prénom" 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                    <InputForm 
                        label="Nom" 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
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
                    <CheckboxForm 
                        label="J'accepte les CGV et CGU" 
                        checked={acceptedTerms}
                        onChange={setAcceptedTerms}
                    />
                    <SubmitButtonForm 
                        label={loading ? "Inscription..." : "Inscription"}
                        disabled={!acceptedTerms || loading} 
                        type="submit"
                        colorClass="bg-blue-500 hover:bg-blue-600 focus:ring-blue-400/20"
                    />
                    <div className="h-0.5 w-2/3 bg-gray-800 mx-auto my-4"></div>
                    <div>

                    </div>
                    <div className="text-sm mx-auto">
                        <p>Déjà un compte ? <a className="text-green-500 hover:text-green-600" href="/login">Se connecter</a></p>
                    </div>
                </div>
            </form>
        </div>
        <div className="w-1/2 h-full">
            <img src="/assets/img/fond-stade-auth.jpg" alt="Description" className="rounded-l-[45px] object-cover object-right h-full w-full" />
        </div>
    </div>
  );
}