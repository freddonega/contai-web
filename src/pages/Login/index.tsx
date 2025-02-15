import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/requests/userRequests";
import { LoginData } from "@/types/user";
import { Input } from "@/components/Input";
import { useAuthStore } from "@/storage/authStorage";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Logo } from "@/components/Logo";
import grid from "@/images/grid-01.svg";

export const Login = () => {
  const { register, handleSubmit } = useForm<LoginData>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      toast.success("Login bem-sucedido");
      // Redirect to home page or dashboard
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.error);
      }
      toast.error("Ocorreu um erro");
    },
  });

  const onSubmit = (data: LoginData) => {
    mutation.mutate(data);
  };

  return (
    <div className="relative flex w-full h-screen px-4 py-6 overflow-hidden bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Login
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Entre com suas credenciais
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div>
                    <Input label="Email" type="email" {...register("email")} />
                  </div>
                  <div>
                    <Input
                      label="Password"
                      type="password"
                      {...register("password")}
                    />
                  </div>

                  <div>
                    <button className="inline-flex items-center justify-center gap-2 rounded-lg transition w-full px-4 py-3 text-sm bg-contai-lightBlue text-white shadow-theme-xs hover: disabled:bg-gray-500/50 disabled:cursor-not-allowed">
                      Entrar
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative items-center justify-center flex-1 hidden p-8 z-1 bg-brand-950 dark:bg-contai-darkBlue lg:flex">
        <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
          <img src={grid} alt="grid" />
        </div>
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
          <Logo />
        </div>
        <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
          <img src={grid} alt="grid" />
        </div>
      </div>
    </div>
  );
};
