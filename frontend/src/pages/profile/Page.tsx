import { API_AUTH, Gender, UpdateProfileReq } from "../../apis/auth";
import { useAtomValue, useSetAtom } from "jotai";
import { profileAtom } from "../stores/profile";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { API_MINIO_FILE } from "../../apis/minioFile";
import toast from "react-hot-toast";
import { accountAtom } from "../stores/account";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import dayjs from "dayjs";

const profileFormSchema = z.object({
  avatarId: z.string(),
  bio: z.string().max(256, { message: `最大输入长度为256个字符` }),
  birthday: z
    .string()
    .max(10, { message: `最大输入长度为10个字符` })
    .regex(/(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])/, {
      message: `请输入正确的日期:YYYY-MM-DD`,
    }),
  email: z
    .string()
    .max(128, { message: `最大输入长度为128个字符` })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: `请输入正确的电子邮箱`,
    }),
  firstName: z
    .string()
    .min(1, { message: `请输入名字` })
    .max(32, { message: `最大输入长度为32个字符` }),
  gender: z.string(),
  lastName: z
    .string()
    .min(1, { message: `请输入姓氏` })
    .max(32, { message: `最大输入长度为32个字符` }),
  phone: z.string().length(11, { message: `请输入中国大陆常用的11位电话号码` }),
});

const ProfilePage = () => {
  const profile = useAtomValue(profileAtom);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      avatarId: profile.avatarId || "",
      bio: profile.bio || "",
      birthday: profile.birthday
        ? dayjs(profile.birthday).format("YYYY-MM-DD")
        : "",
      email: profile.email || "",
      firstName: profile.firstName || "",
      gender: profile.gender || "",
      lastName: profile.lastName || "",
      phone: profile.phone || "",
    },
  });

  const AvatarInputRef = useRef<HTMLInputElement>(null);

  const {
    isPending: uploadAvatarIsPending,
    mutate: uploadAvatar,
    isError: uploadAvatarIsError,
    error: uploadAvatarError,
  } = useMutation({
    mutationFn: (file: File) => API_MINIO_FILE.UPLOAD_SMALL_FILE(file),
    onSuccess: (res) => {
      profileForm.setValue("avatarId", res.data.id);
      AvatarInputRef.current!.value = "";
    },
  });

  const setProfile = useSetAtom(profileAtom);

  const {
    isPending: saveIsPending,
    mutate: save,
    isError: saveIsError,
    error: saveError,
  } = useMutation({
    mutationFn: (payload: UpdateProfileReq) => API_AUTH.UPDATE_PROFILE(payload),
    onSuccess: (res) => {
      setProfile(res.data);
      toast.success("保存成功");
    },
  });

  const handleSave = (values: z.infer<typeof profileFormSchema>) => {
    save({
      avatarId: values.avatarId,
      bio: values.bio,
      birthday: new Date(values.birthday).toISOString(),
      email: values.email,
      firstName: values.firstName,
      gender: values.gender as Gender,
      lastName: values.lastName,
      phone: values.phone,
    });
  };

  const setAccount = useSetAtom(accountAtom);

  const navigate = useNavigate();

  const handleLogout = () => {
    setAccount({ id: "", username: "", createdAt: "", updatedAt: "" });
    setProfile({
      id: "",
      accountId: "",
      avatarId: "",
      firstName: "",
      lastName: "",
      bio: "",
      email: "",
      phone: "",
      birthday: "",
      gender: null,
      createdAt: "",
      updatedAt: "",
    });
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl">笨钟账单</h1>

      <h2 className="text-xl">用户资料</h2>

      {uploadAvatarIsError && (
        <Alert variant="destructive">
          <AlertTitle>错误</AlertTitle>
          <AlertDescription>{uploadAvatarError.message}</AlertDescription>
        </Alert>
      )}

      <Form {...profileForm}>
        <form
          onSubmit={profileForm.handleSubmit(handleSave)}
          className="flex flex-col gap-6"
        >
          <div className="flex gap-6 items-end">
            <input
              type="file"
              ref={AvatarInputRef}
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAvatar(file);
              }}
              accept=".jpg,.jpeg,.png"
            />

            <Avatar
              onClick={
                uploadAvatarIsPending
                  ? undefined
                  : () => {
                      AvatarInputRef.current?.click();
                    }
              }
            >
              <AvatarImage
                src={`/api/minio-file/${profileForm.getValues("avatarId")}`}
                alt="avatar"
              />
              <AvatarFallback>BB</AvatarFallback>
            </Avatar>

            <FormField
              control={profileForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>名字</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={saveIsPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>姓氏</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={saveIsPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={profileForm.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>个人介绍</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="bio"
                    {...field}
                    disabled={saveIsPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>性别</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={saveIsPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="性别" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={Gender.FEMALE}>女</SelectItem>
                      <SelectItem value={Gender.MALE}>男</SelectItem>
                      <SelectItem value={Gender.OTHER}>其他</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>电子邮箱</FormLabel>
                <FormControl>
                  <Input {...field} disabled={saveIsPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>电话号码</FormLabel>
                <FormControl>
                  <Input {...field} disabled={saveIsPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={profileForm.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>生日</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="YYYY-MM-DD"
                    disabled={saveIsPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {saveIsError && (
            <Alert variant="destructive">
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{saveError.message}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            disabled={saveIsPending || uploadAvatarIsPending}
          >
            提交
          </Button>
        </form>

        <Button onClick={handleLogout} variant="destructive">
          退出登录
        </Button>
      </Form>
    </div>
  );
};

export default ProfilePage;
