import "../styles/globals.css";
import "../firebase/config/firebase.config";
import { AuthProvider } from "../firebase/hook/auth";
import AuthStateChanged from "../firebase/layout/AuthStateChanged";
import AppLayout from "../firebase/layout/AppLayout";

// https://www.youtube.com/watch?v=GkdHUX2Xxvk

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppLayout>
        <AuthStateChanged>
          <Component {...pageProps} />
        </AuthStateChanged>
      </AppLayout>
    </AuthProvider>
  );
}

export default MyApp;
