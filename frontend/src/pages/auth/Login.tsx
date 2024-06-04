import { useImmer } from "use-immer";
import { API_AUTH, LoginReq } from "../../apis/auth";
import VStack from "../../components/VStack";
import { Alert, Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FormEvent } from "react";

const initalData: LoginReq = {
  username: "",
  password: "",
};

const Login = () => {
  const [data, setData] = useImmer<LoginReq>(initalData);

  const { isPending, mutate, isError, error } = useMutation({
    mutationFn: () => API_AUTH.LOGIN(data),
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.username && data.password) {
      mutate();
    } else {
      toast.error("用户名和密码不能为空");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <VStack>
          <TextField
            label="用户名"
            type="text"
            value={data.username}
            onChange={(e) =>
              setData((d) => {
                d.username = e.target.value;
              })
            }
          />

          <TextField
            label="密码"
            type="password"
            value={data.password}
            onChange={(e) =>
              setData((d) => {
                d.password = e.target.value;
              })
            }
          />

          {isError && <Alert severity="error">{error.message}</Alert>}

          <Button type="submit" disabled={isPending}>
            登录
          </Button>
        </VStack>
      </form>
    </>
  );
};

export default Login;
