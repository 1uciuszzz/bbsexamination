import { useMutation, useQuery } from "@tanstack/react-query";
import {
  API_BILLING,
  Billing,
  BillingCategory,
  BillingType,
  ListReq,
} from "../../apis/billing";
import { useImmer } from "use-immer";
import VStack from "../../components/VStack";
import HStack from "../../components/HStack";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Close, Logout, SaveAlt } from "@mui/icons-material";
import Back from "../../components/Back";
import toast from "react-hot-toast";

type BillingListItemProps = {
  billing: Billing;
};

const BillingListItem = ({ billing }: BillingListItemProps) => {
  const navigate = useNavigate();

  return (
    <Alert
      key={billing.id}
      icon={false}
      sx={{
        borderLeft: `8px solid ${
          billing.category == BillingCategory.FOOD
            ? "#eb3140"
            : billing.category == BillingCategory.SHOPPING
              ? "#2189dc"
              : billing.category == BillingCategory.TRANSPORT
                ? "#fff321"
                : billing.category == BillingCategory.ENTERTAINMENT
                  ? "#34cd2b"
                  : billing.category == BillingCategory.HEALTH
                    ? "#f8772b"
                    : billing.category == BillingCategory.EDUCATION
                      ? "#977fe7"
                      : billing.category == BillingCategory.OTHER
                        ? "#9b6b48"
                        : "#aaaaaa"
        }`,
      }}
      action={
        <IconButton onClick={() => navigate(`/billing/delete/${billing.id}`)}>
          <Close />
        </IconButton>
      }
    >
      <VStack>
        <HStack>
          {billing.type == BillingType.EXPENSE ? (
            <Logout fontSize="small" />
          ) : (
            <SaveAlt fontSize="small" />
          )}
          <Typography fontFamily="monospace" variant="body1">
            ${billing.amount}
          </Typography>
          <Typography title={billing.name}>{billing.name}</Typography>
        </HStack>
        <HStack>
          <Typography variant="caption">
            {dayjs(billing.time).format("YYYY-MM-DD HH:mm:ss")}
          </Typography>
        </HStack>
      </VStack>
    </Alert>
  );
};

const initialData: ListReq = {
  startTime: "",
  endTime: "",
};

const BillingList = () => {
  const [q, setQ] = useImmer<ListReq>(initialData);

  const { isPending, data, isError, error } = useQuery({
    queryKey: ["billings", q],
    queryFn: () => API_BILLING.LIST(q),
  });

  const handleClearStartTime = () => {
    setQ((d) => {
      d.startTime = "";
    });
  };
  const handleClearEndTime = () => {
    setQ((d) => {
      d.endTime = "";
    });
  };

  const {
    isPending: exportIsPending,
    isError: exportIsError,
    error: exportError,
    mutate: doExport,
  } = useMutation({
    mutationFn: async () => {
      const canvas = document.createElement("canvas");
      canvas.width = 540;
      canvas.height = (data?.data.billings.length || 1) * 30 + 240;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        toast.error(`Can not get context.`);
        return;
      }
      ctx.fillStyle = `#ffffff`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = `#000000`;
      ctx.font = `bold 40px sans-serif`;
      ctx.textBaseline = "top";
      ctx.fillText(`B1g Ben Billings`, 110, 50);
      const today = new Date();
      const startTime = q.startTime
        ? dayjs(q.startTime).format(`YYYY-MM-DD`)
        : dayjs(today).subtract(7, "days").format(`YYYY-MM-DD`);
      const endTime = q.endTime
        ? dayjs(q.endTime).format(`YYYY-MM-DD`)
        : dayjs(today).format(`YYYY-MM-DD`);
      ctx.fillStyle = `#888888`;
      ctx.font = `20px monospace`;
      ctx.fillText(`${startTime} _ ${endTime}`, 150, 100);
      ctx.beginPath();
      ctx.moveTo(20, 130);
      ctx.lineTo(520, 130);
      ctx.stroke();
      ctx.closePath();
      ctx.fillStyle = `#395260`;
      data?.data.billings.forEach((b, i) => {
        ctx.fillText(`${b.amount >= 100 ? "❗" : ""}`, 5, 150 + i * 30);
        ctx.fillText(
          `${
            b.category == BillingCategory.FOOD
              ? "🔴"
              : b.category == BillingCategory.SHOPPING
                ? "🔵"
                : b.category == BillingCategory.TRANSPORT
                  ? "🟡"
                  : b.category == BillingCategory.ENTERTAINMENT
                    ? "🟢"
                    : b.category == BillingCategory.HEALTH
                      ? "🟠"
                      : b.category == BillingCategory.EDUCATION
                        ? "🟣"
                        : "🟤"
          }  ${b.type == BillingType.EXPENSE ? "💸" : "💰"}  ${dayjs(b.time).format(`MM/DD HH:mm`)}  ${b.name}  💲 ${b.amount}`,
          30,
          150 + i * 30
        );
      });
      ctx.beginPath();
      ctx.moveTo(20, 170 + (data?.data.billings.length || 1) * 30);
      ctx.lineTo(520, 170 + (data?.data.billings.length || 1) * 30);
      ctx.stroke();
      ctx.fillText(
        `💴结算金额：${(data?.data.expense || 0) + (data?.data.income || 0)}`,
        20,
        190 + (data?.data.billings.length || 1) * 30
      );
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error(`Generate image failed.`);
          return;
        }
        const a = document.createElement("a");
        const url = URL.createObjectURL(
          new Blob([blob], { type: "image/jpeg" })
        );
        a.href = url;
        a.download = `${startTime}_${endTime}_billings.jpg`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/jpeg");
    },
  });

  if (isPending) return <CircularProgress />;

  if (isError) return <Alert severity="error">{error.message}</Alert>;

  return (
    <>
      <div className="p-4">
        <VStack>
          <HStack>
            <Back to="/" />
            <Typography variant="h5">Billing List</Typography>
          </HStack>

          <HStack>
            <DatePicker
              label="Start Time"
              value={q.startTime ? dayjs(q.startTime) : null}
              onChange={(v) => {
                if (v) {
                  setQ((d) => {
                    d.startTime = v.toISOString();
                  });
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
                field: {
                  clearable: true,
                  onClear: () => {
                    setQ((d) => {
                      d.startTime = "";
                    });
                  },
                },
              }}
            />

            <DatePicker
              label="End Time"
              value={q.endTime ? dayjs(q.endTime) : null}
              onChange={(v) => {
                if (v) {
                  setQ((d) => {
                    d.endTime = v.toISOString();
                  });
                }
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                },
                field: {
                  clearable: true,
                  onClear: () => {
                    setQ((d) => {
                      d.endTime = "";
                    });
                  },
                },
              }}
            />
          </HStack>

          <HStack>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleClearStartTime}
            >
              Clear Start Time
            </Button>

            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleClearEndTime}
            >
              Clear End Time
            </Button>
          </HStack>

          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/billing/create"
          >
            Create a new billing
          </Button>

          <Card>
            <CardContent>
              <VStack>
                <HStack>
                  <Typography variant="h6">Total Income</Typography>
                  <Typography
                    variant="h6"
                    flexGrow={1}
                    textAlign="end"
                    fontFamily="monospace"
                  >
                    ${data.data.income}
                  </Typography>
                </HStack>
                <HStack>
                  <Typography variant="h6">Total Expense</Typography>
                  <Typography
                    variant="h6"
                    flexGrow={1}
                    textAlign="end"
                    fontFamily="monospace"
                  >
                    ${data.data.expense}
                  </Typography>
                </HStack>
                <HStack>
                  <Typography variant="h6">Remaining</Typography>
                  <Typography
                    variant="h6"
                    flexGrow={1}
                    textAlign="end"
                    fontFamily="monospace"
                  >
                    ${data.data.income - data.data.expense}
                  </Typography>
                </HStack>
              </VStack>
            </CardContent>
          </Card>

          {Array.from(
            new Set(
              data.data.billings.map((b) => {
                const date = dayjs(b.time).format("YYYY-MM-DD");
                return date;
              })
            )
          ).map((date) => {
            return (
              <VStack key={date}>
                <Typography variant="h6">{date}</Typography>
                {data.data.billings
                  .filter((b) => {
                    const d = dayjs(b.time).format("YYYY-MM-DD");
                    return d === date;
                  })
                  .map((b) => {
                    return <BillingListItem key={b.id} billing={b} />;
                  })}
              </VStack>
            );
          })}

          {exportIsError && (
            <Alert severity="error">{exportError.message}</Alert>
          )}

          <Button
            onClick={() => {
              doExport();
            }}
            disabled={exportIsPending}
          >
            Export current data as an image
          </Button>
        </VStack>
      </div>

      <Outlet />
    </>
  );
};

export default BillingList;
