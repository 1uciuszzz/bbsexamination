import { useQuery } from "@tanstack/react-query";
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
              : billing.category == BillingCategory.TRANSPORTATION
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
        </VStack>
      </div>

      <Outlet />
    </>
  );
};

export default BillingList;
