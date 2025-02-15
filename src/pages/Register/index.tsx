import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "@/requests/userRequests";
import { CreateUser } from "@/types/user";
import { Input } from "@/components/Input";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Logo } from "@/components/Logo";
import grid from "@/images/grid-01.svg";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Define the validation schema
const schema = yup
  .object({
    name: yup.string().required("Nome é obrigatório"),
    email: yup
      .string()
      .email("E-mail inválido")
      .required("E-mail é obrigatório"),
    password: yup
      .string()
      .required("Senha é obrigatória")
      .min(6, "A senha deve ter no mínimo 6 caracteres"),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "As senhas não coincidem")
      .required("Confirmação de senha é obrigatória"),
  })
  .required();

export const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast.success("Cadastro bem-sucedido");
      // Redirect to login page or dashboard
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.error);
      }
      toast.error("Ocorreu um erro");
    },
  });

  const onSubmit = (data: CreateUser) => {
    mutation.mutate(data);
  };

  return (
    <div className="relative flex w-full h-screen px-4 py-6 overflow-hidden bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div>
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Cadastro
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Crie sua conta
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div>
                    <Input
                      label="Nome"
                      type="text"
                      {...register("name")}
                      error={errors.name?.message}
                    />
                  </div>
                  <div>
                    <Input
                      label="E-mail"
                      type="email"
                      {...register("email")}
                      error={errors.email?.message}
                    />
                  </div>
                  <div>
                    <Input
                      label="Senha"
                      type="password"
                      {...register("password")}
                      error={errors.password?.message}
                    />
                  </div>
                  <div>
                    <Input
                      label="Confirme a senha"
                      type="password"
                      {...register("passwordConfirmation")}
                      error={errors.passwordConfirmation?.message}
                    />
                  </div>

                  <div>
                    <button
                      className="inline-flex items-center justify-center gap-2 rounded-lg transition w-full px-4 py-3 text-sm bg-contai-lightBlue text-white shadow-theme-xs hover: disabled:bg-gray-500/50 disabled:cursor-not-allowed"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Carregando..." : "Cadastrar"}
                    </button>
                  </div>
                  <div className="text-center">
                    <Link
                      to="/login"
                      className="text-sm text-contai-lightBlue hover:underline"
                    >
                      Já tem uma conta? Faça login
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
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
