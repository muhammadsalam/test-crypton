import { BrowserRouter, Route, Routes } from "react-router";
import { RegisterPage } from "@/pages/register";
import { AuthPage } from "./pages/auth";
import { ProfilePage } from "./pages/profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<ProfilePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
