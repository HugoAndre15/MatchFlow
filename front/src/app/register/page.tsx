'use client';

import { useState } from "react";
import InputForm from "../../components/form/inputForm";
import CheckboxForm from "../../components/form/CheckboxForm";
import SubmitButtonForm from "../../components/form/SubmitButtonForm";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import { registerSchema } from "@/utils/validationSchemas";
import { z } from "zod";

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setFieldErrors({});
        setLoading(true);

        // Validation avec Zod
        try {
            registerSchema.parse(formData);
        } catch (err) {
            if (err instanceof z.ZodError) {
                const errors: Record<string, string> = {};
                err.issues.forEach((issue) => {
                    if (issue.path[0]) {
                        errors[issue.path[0] as string] = issue.message;
                    }
                });
                setFieldErrors(errors);
                setLoading(false);
                return;
            }
        }

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
                {error && (
                    <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-300">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" 
                            fill="currentColor" 
                            className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                        >
                            <path 
                                fillRule="evenodd" 
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" 
                                clipRule="evenodd" 
                            />
                        </svg>
                        <p className="text-red-700 text-sm font-medium leading-relaxed">{error}</p>
                    </div>
                )}
                <div className="w-full flex flex-col items-start gap-4 pr-20">
                    <InputForm 
                        label="Prénom" 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        error={fieldErrors.firstName}
                    />
                    <InputForm 
                        label="Nom" 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        error={fieldErrors.lastName}
                    />
                    <InputForm 
                        label="Email" 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        error={fieldErrors.email}
                    />
                    <InputForm 
                        label="Mot de passe" 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        error={fieldErrors.password}
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