import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { http } from "@/shared/libs/utils";
import { AxiosError } from "axios";
import { useUserStore } from "@/entities/user";

type RRegister = {
    token: string;
    type: "bearer";
};

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: {
            email?: string;
            password?: string;
            confirmPassword?: string;
        } = {};

        if (!email) {
            newErrors.email = "Email обязателен";
        }
        if (!password) {
            newErrors.password = "Пароль обязателен";
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Пароли не совпадают";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const { data } = await http.post<RRegister>("/register", {
                    email,
                    password,
                });
                useUserStore.setState({ token: data.token });
                localStorage.setItem("token", data.token);
                navigate("/");
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    alert(error.response?.data.message);
                } else {
                    alert("An unexpected error occurred");
                }
            }
        }
    };

    const token = useUserStore((state) => state.token);

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-[#0d1117] text-[#f5efe2] p-6 rounded-2xl shadow-lg w-80">
                <h2 className="text-2xl font-semibold text-center mb-5">
                    Регистрация
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm mb-1 text-left">
                            Email
                        </label>
                        <Input
                            type="email"
                            className="bg-[#f5efe2] text-black placeholder:text-gray-500"
                            placeholder="Введите ваш Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm text-left">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-1 text-left">
                            Password
                        </label>
                        <Input
                            type="password"
                            className="bg-[#f5efe2] text-black placeholder:text-gray-500"
                            placeholder="Придумайте пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm text-left">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm mb-1 text-left">
                            Confirm password
                        </label>
                        <Input
                            type="password"
                            className="bg-[#f5efe2] text-black placeholder:text-gray-500"
                            placeholder="Подтвердите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm text-left">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    <p className="text-sm text-left">
                        Уже есть аккаунт?{" "}
                        <Link
                            to="/auth"
                            className="text-inherit font-normal hover:text-white underline"
                        >
                            Войти
                        </Link>
                    </p>

                    <Button
                        type="submit"
                        className="w-full border border-[#f5efe2] text-[#f5efe2] mt-10"
                    >
                        Создать аккаунт
                    </Button>
                </form>
            </div>
        </div>
    );
};
