import { useMutation, useQuery } from "@tanstack/react-query";
import {
  API_BILLING,
  Billing,
  BillingCategory,
  BillingType,
} from "../../apis/billing";
import { useImmer } from "use-immer";
import dayjs from "dayjs";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Back from "../../components/Back";
import toast from "react-hot-toast";
import PageLoader from "@/components/PageLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CalendarIcon, HandCoins, Import, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { zhCN } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type BillingListItemProps = {
  billing: Billing;
};

const BillingListItem = ({ billing }: BillingListItemProps) => {
  const navigate = useNavigate();

  return (
    <Alert
      key={billing.id}
      style={{
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
    >
      <AlertTitle>
        <div className="flex items-center gap-2">
          {billing.type == BillingType.EXPENSE ? (
            <HandCoins size={18} />
          ) : (
            <Import size={18} />
          )}
          <Badge className="font-mono">{billing.amount}</Badge>
          <p title={billing.name}>{billing.name}</p>
        </div>
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <small>{dayjs(billing.time).format("YYYY-MM-DD HH:mm:ss")}</small>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => navigate(`/billing/delete/${billing.id}`)}
          className="w-6 h-6"
        >
          <X />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

const BillingList = () => {
  const [startTime, setStartTime] = useImmer<Date | undefined>(undefined);

  const [endTime, setEndTime] = useImmer<Date | undefined>(undefined);

  const { isPending, data, isError, error } = useQuery({
    queryKey: ["billings", startTime, endTime],
    queryFn: () =>
      API_BILLING.LIST({
        startTime: startTime?.toISOString(),
        endTime: endTime?.toISOString(),
      }),
  });

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
      const st = startTime
        ? dayjs(startTime).format(`YYYY-MM-DD`)
        : dayjs(today).subtract(7, "days").format(`YYYY-MM-DD`);
      const et = endTime
        ? dayjs(endTime).format(`YYYY-MM-DD`)
        : dayjs(today).format(`YYYY-MM-DD`);
      ctx.fillStyle = `#888888`;
      ctx.font = `20px monospace`;
      ctx.fillText(`${st} _ ${et}`, 150, 100);
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
        a.download = `${st}_${et}_billings.jpg`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/jpeg");
    },
  });

  if (isPending) return <PageLoader />;

  if (isError)
    return (
      <Alert variant="destructive">
        <AlertTitle>错误</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center gap-2">
          <Back to="/" />
          <h2 className="text-2xl">账单列表</h2>
        </div>

        <div className="flex gap-6 justify-between">
          <div className="flex-1 flex">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <CalendarIcon />
                  {startTime ? (
                    format(startTime, "PPP", { locale: zhCN })
                  ) : (
                    <span>起始日期</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startTime}
                  onSelect={setStartTime}
                  initialFocus
                  locale={zhCN}
                />
              </PopoverContent>
            </Popover>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setStartTime(undefined);
              }}
            >
              <X />
            </Button>
          </div>
          <div className="flex-1 flex">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <CalendarIcon />
                  {endTime ? (
                    format(endTime, "PPP", { locale: zhCN })
                  ) : (
                    <span>结束日期</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endTime}
                  onSelect={setEndTime}
                  initialFocus
                  locale={zhCN}
                />
              </PopoverContent>
            </Popover>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setEndTime(undefined);
              }}
            >
              <X />
            </Button>
          </div>
        </div>

        <Button asChild>
          <Link to="/billing/create">创建新账单</Link>
        </Button>

        <div className="flex justify-between">
          <div className="flex gap-2">
            <p>总收入</p>
            <Badge className="font-mono">{data.data.income}</Badge>
          </div>

          <div className="flex gap-2">
            <p>总支出</p>
            <Badge className="font-mono">{data.data.expense}</Badge>
          </div>
          <div className="flex gap-2">
            <p>总结余</p>
            <Badge className="font-mono">
              {data.data.income - data.data.expense}
            </Badge>
          </div>
        </div>
        <Separator />

        {Array.from(
          new Set(
            data.data.billings.map((b) => {
              const date = dayjs(b.time).format("YYYY-MM-DD");
              return date;
            })
          )
        ).map((date) => {
          return (
            <div key={date} className="flex flex-col gap-2">
              <h6 className="text-xl font-mono">{date}</h6>
              {data.data.billings
                .filter((b) => {
                  const d = dayjs(b.time).format("YYYY-MM-DD");
                  return d === date;
                })
                .map((b) => {
                  return <BillingListItem key={b.id} billing={b} />;
                })}
            </div>
          );
        })}

        {exportIsError && (
          <Alert variant="destructive">
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{exportError.message}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={() => {
            doExport();
          }}
          disabled={exportIsPending}
        >
          导出当前数据为图片
        </Button>
      </div>

      <Outlet />
    </>
  );
};

export default BillingList;
