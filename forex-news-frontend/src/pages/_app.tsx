import { UserDetailsProvider } from "@/context/userDetails";
import "@/styles/globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="1053547873890-bvpncbq33l97sq5horcu9ospbu3m7mnd.apps.googleusercontent.com">
      <UserDetailsProvider>
        <Component {...pageProps} />
      </UserDetailsProvider>
    </GoogleOAuthProvider>
  );
}
