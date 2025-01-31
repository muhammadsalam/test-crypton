import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/entities/user";
import { http } from "@/shared/libs/utils";
import { AxiosError } from "axios";
import { Mail, Key } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

type RProfile = {
    email: string;
    id: string;
};

export const ProfilePage = () => {
    const navigate = useNavigate();
    const [isFetchingProfile, setIsFetchingProfile] = useState(true);
    const { id, email, token } = useUserStore((state) => state);

    useEffect(() => {
        (async () => {
            if (!token) {
                return navigate("/auth");
            }

            setIsFetchingProfile(true);
            try {
                const { data } = await http.get<RProfile>("/profile");
                useUserStore.setState({ email: data.email, id: data.id });
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    alert(error.response?.data.message);
                } else {
                    alert("An unexpected error occurred");
                }
                navigate("/auth");
            } finally {
                setIsFetchingProfile(false); // Завершаем загрузку
            }
        })();
    }, []);

    const handleExit = () => {
        localStorage.removeItem("token");
        useUserStore.setState({ email: "", token: "", id: "" });
        navigate("/auth");
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="bg-[#0d1117] text-[#f5efe2] p-6 rounded-2xl shadow-lg w-80">
                <h2 className="text-[22px] font-semibold text-center mb-4">
                    Профиль
                </h2>

                {isFetchingProfile ? (
                    <>
                        <Skeleton className="h-16 w-full mb-4 bg-[lightgrey]" />
                        <Skeleton className="h-16 w-full mb-4 bg-[lightgrey]" />
                    </>
                ) : (
                    <>
                        <div className="p-3 mb-4 border border-[lightgrey] rounded-lg flex flex-col items-start">
                            <p className="text-sm w-full flex items-center gap-2 text-[lightgray]">
                                <Mail size={16} />
                                Ваш Email
                            </p>
                            <p className="text-md text-left font-semibold">
                                {email}
                            </p>
                        </div>

                        <div className="p-3 mb-4 border border-[lightgrey] rounded-lg flex flex-col items-start">
                            <p className="text-sm w-full flex items-center gap-2 text-[lightgray]">
                                <Key className="text-[#f5efe2]" size={16} />
                                Ваш ID
                            </p>
                            <p className="text-md text-left font-semibold">
                                {id}
                            </p>
                        </div>

                        <Button
                            className="w-full border border-[#f5efe2] text-[#f5efe2] mt-20"
                            onClick={handleExit}
                        >
                            Выйти
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};
