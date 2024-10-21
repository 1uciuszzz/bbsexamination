import {
  Alert,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useImmer } from "use-immer";
import { API_AUTH, Gender, Profile } from "../../apis/auth";
import { useAtomValue, useSetAtom } from "jotai";
import { profileAtom } from "../stores/profile";
import { AccountCircle } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { API_MINIO_FILE } from "../../apis/minioFile";
import toast from "react-hot-toast";
import { accountAtom } from "../stores/account";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const profile = useAtomValue(profileAtom);

  const [data, setData] = useImmer<Profile>(profile);

  const AvatarInputRef = useRef<HTMLInputElement>(null);

  const {
    isPending: uploadAvatarIsPending,
    mutate: uploadAvatar,
    isError: uploadAvatarIsError,
    error: uploadAvatarError,
  } = useMutation({
    mutationFn: (file: File) => API_MINIO_FILE.UPLOAD_SMALL_FILE(file),
    onSuccess: (res) => {
      setData((d) => {
        d.avatarId = res.data.id;
      });
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
    mutationFn: () =>
      API_AUTH.UPDATE_PROFILE({
        avatarId: data.avatarId || "",
        bio: data.bio || "",
        birthday: data.birthday || "",
        email: data.email || "",
        firstName: data.firstName || "",
        gender: data.gender || Gender.OTHER,
        lastName: data.lastName || "",
        phone: data.phone || "",
      }),
    onSuccess: (res) => {
      setProfile(res.data);
      toast.success("Saved");
    },
  });

  const handleSave = () => {
    save();
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
    <>
      <div className="flex flex-col gap-6 p-6">
        <Typography variant="h5">笨钟账单</Typography>

        <Typography variant="h6">用户资料</Typography>

        {uploadAvatarIsError && (
          <Alert severity="error">{uploadAvatarError.message}</Alert>
        )}

        <div className="flex justify-center">
          <input
            type="file"
            ref={AvatarInputRef}
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadAvatar(file);
            }}
            accept="image/*"
          />
          <IconButton
            onClick={() => AvatarInputRef.current!.click()}
            disabled={uploadAvatarIsPending}
          >
            {data.avatarId ? (
              <img
                src={`/api/minio-file/${data.avatarId}`}
                alt="avatar"
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <AccountCircle fontSize="large" />
            )}
          </IconButton>
        </div>

        <div className="flex gap-6">
          <TextField
            fullWidth
            variant="standard"
            label="名"
            type="text"
            value={data.firstName || ""}
            onChange={(e) =>
              setData((d) => {
                d.firstName = e.target.value;
              })
            }
          />

          <TextField
            fullWidth
            variant="standard"
            label="姓"
            type="text"
            value={data.lastName || ""}
            onChange={(e) =>
              setData((d) => {
                d.lastName = e.target.value;
              })
            }
          />
        </div>

        <TextField
          variant="standard"
          label="个人介绍"
          type="text"
          value={data.bio || ""}
          onChange={(e) =>
            setData((d) => {
              d.bio = e.target.value;
            })
          }
          multiline
          rows={3}
        />

        <FormControl variant="standard">
          <InputLabel>性别</InputLabel>
          <Select
            value={data.gender || Gender.OTHER}
            onChange={(e) => {
              setData((d) => {
                d.gender = e.target.value as Gender;
              });
            }}
          >
            <MenuItem value={Gender.MALE}>男</MenuItem>
            <MenuItem value={Gender.FEMALE}>女</MenuItem>
            <MenuItem value={Gender.OTHER}>其他</MenuItem>
          </Select>
        </FormControl>

        <TextField
          variant="standard"
          label="电子邮箱"
          type="email"
          value={data.email || ""}
          onChange={(e) =>
            setData((d) => {
              d.email = e.target.value;
            })
          }
        />

        <TextField
          variant="standard"
          label="电话号码"
          type="tel"
          value={data.phone || ""}
          onChange={(e) =>
            setData((d) => {
              d.phone = e.target.value;
            })
          }
        />

        <DatePicker
          label="生日"
          value={data.birthday ? dayjs(data.birthday) : null}
          onChange={(v) => {
            if (v) {
              setData((d) => {
                d.birthday = v.toISOString();
              });
            }
          }}
          slotProps={{
            textField: {
              variant: "standard",
            },
          }}
        />

        {saveIsError && <Alert severity="error">{saveError.message}</Alert>}

        <Button
          variant="outlined"
          onClick={handleSave}
          disabled={saveIsPending}
        >
          提交
        </Button>

        <Button onClick={handleLogout} variant="outlined" color="error">
          退出登录
        </Button>
      </div>
    </>
  );
};

export default ProfilePage;
