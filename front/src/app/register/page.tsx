'use client';

import { useState } from "react";
import InputForm from "../components/form/inputForm";
import CheckboxForm from "../components/form/CheckboxForm";
import SubmitButtonForm from "../components/form/SubmitButtonForm";

export default function Register() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <div className="h-screen flex items-center bg-gradient-to-br from-white-100 to-white-200">
        <div className="text-left items-start flex flex-col gap-16 w-1/2 h-full py-8 items-center justify-center">
            <div className="min-w-1/2 flex flex-col items-start justify-center gap-8 mx-auto">
                <div className="">
                    <h1 className="text-3xl font-medium text-gray-900">
                        Commencez dès maintenant
                    </h1>
                    <h2 className="text-base font-medium text-gray-700">
                        Entrez vos informations pour créer votre compte
                    </h2>
                </div>
                <div className="w-full flex flex-col items-start gap-4 pr-20">
                    <InputForm label="Prénom" type="text" />
                    <InputForm label="Nom" type="text" />
                    <InputForm label="Email" type="email" />
                    <InputForm label="Mot de passe" type="password" />
                    <CheckboxForm 
                        label="J'accepte les CGV et CGU" 
                        checked={acceptedTerms}
                        onChange={setAcceptedTerms}
                    />
                    <SubmitButtonForm 
                        label="Inscription" 
                        disabled={!acceptedTerms} 
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
            </div>
        </div>
        <div className="w-1/2 h-full">
            <img src="/assets/img/fond-stade-auth.jpg" alt="Description" className="rounded-l-[45px] object-cover object-right h-full w-full" />
        </div>
    </div>
  );
}