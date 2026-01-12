"use client";

import { setCookie } from 'cookies-next';

export type LoginButtonParams = {
    id : string
}

export default function LoginButton(params : LoginButtonParams) {
    setCookie('id', params.id , { maxAge: 60 * 10 }) //10 minutes
    return (
        <a
            href="/auth/login"
            className="bg-white"
        >
            Log In
        </a>
    );
}