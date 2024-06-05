import dayjs from "dayjs";
import {
  Billing,
  CreateBillingReq,
  BillingType,
  BillingCategory,
  API_BILLING,
} from "../../apis/billing";
import { useImmer } from "use-immer";
import VStack from "../../components/VStack";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type BillingFormProps = {
  initialData?: Billing;
};

const emptyData: CreateBillingReq = {
  name: "",
  amount: 0,
  type: BillingType.EXPENSE,
  category: BillingCategory.OTHER,
  time: dayjs().toISOString(),
};

const BillingForm = ({ initialData }: BillingFormProps) => {
  const [data, setData] = useImmer<Billing | CreateBillingReq>(
    initialData || emptyData
  );

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { isPending, mutate, isError, error } = useMutation({
    mutationFn: () =>
      API_BILLING.CREATE({
        type: data.type,
        name: data.name,
        amount: data.amount,
        category: data.category,
        time: data.time,
      }),
    onSuccess: () => {
      setData(emptyData);
      queryClient.invalidateQueries({
        queryKey: ["billings"],
      });
      toast.success("Success");
      navigate("/billing");
    },
  });

  const handleSubmit = () => {
    if (data.name && data.amount) {
      mutate();
    } else {
      toast.error("Please fill in the required fields");
    }
  };

  return (
    <>
      <div className="p-4">
        <VStack>
          <Typography variant="h5">Create billing</Typography>

          <FormControl>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={data.type}
              onChange={(e) => {
                setData((d) => {
                  d.type = e.target.value as BillingType;
                });
              }}
            >
              <MenuItem value={BillingType.EXPENSE}>Expense</MenuItem>
              <MenuItem value={BillingType.INCOME}>Income</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Name"
            type="text"
            required
            value={data.name}
            onChange={(e) => {
              setData((d) => {
                d.name = e.target.value;
              });
            }}
          />

          <TextField
            label="Amount"
            type="text"
            required
            value={data.amount ? data.amount.toString() : ""}
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (isNaN(v)) {
                if (e.target.value == "") {
                  setData((d) => {
                    d.amount = 0;
                  });
                }
              } else {
                setData((d) => {
                  d.amount = v;
                });
              }
            }}
          />

          {data.type === BillingType.EXPENSE && (
            <FormControl>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={data.category}
                onChange={(e) => {
                  setData((d) => {
                    d.category = e.target.value as BillingCategory;
                  });
                }}
              >
                <MenuItem value={BillingCategory.FOOD}>🔴Food</MenuItem>
                <MenuItem value={BillingCategory.SHOPPING}>🔵Shopping</MenuItem>
                <MenuItem value={BillingCategory.TRANSPORTATION}>
                  🟡Transportation
                </MenuItem>
                <MenuItem value={BillingCategory.ENTERTAINMENT}>
                  🟢Entertainment
                </MenuItem>
                <MenuItem value={BillingCategory.HEALTH}>🟠Health</MenuItem>
                <MenuItem value={BillingCategory.EDUCATION}>
                  🟣Education
                </MenuItem>
                <MenuItem value={BillingCategory.OTHER}>🟤Other</MenuItem>
              </Select>
            </FormControl>
          )}

          <DateTimePicker
            label="Time"
            value={data.time ? dayjs(data.time) : null}
            onChange={(v) => {
              if (v) {
                setData((d) => {
                  d.time = dayjs(v).toISOString();
                });
              }
            }}
          />

          {isError && <Alert severity="error">{error.message}</Alert>}

          <Button
            variant="outlined"
            disabled={isPending}
            onClick={handleSubmit}
          >
            Submit
          </Button>

          <Button
            color="warning"
            variant="outlined"
            disabled={isPending}
            onClick={() => navigate("/billing")}
          >
            Cancel
          </Button>
        </VStack>
      </div>
    </>
  );
};

export default BillingForm;
