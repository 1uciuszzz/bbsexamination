import {
  CreateBillingReq,
  BillingType,
  BillingCategory,
  API_BILLING,
} from "../../apis/billing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { zhCN } from "date-fns/locale";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Back from "@/components/Back";

const billingFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: `请输入账单名称` })
    .max(32, { message: `账单名称过长(不超过32个字符)` }),
  amount: z
    .number()
    .min(1, { message: `请输入账单金额` })
    .max(9999999, { message: `账单金额过大(不高于9999999)` }),
  type: z.enum([BillingType.EXPENSE, BillingType.INCOME]),
  category: z.enum([
    BillingCategory.EDUCATION,
    BillingCategory.ENTERTAINMENT,
    BillingCategory.FOOD,
    BillingCategory.HEALTH,
    BillingCategory.OTHER,
    BillingCategory.SHOPPING,
    BillingCategory.TRANSPORT,
  ]),
  time: z.date(),
});

const BillingForm = () => {
  const billingForm = useForm<z.infer<typeof billingFormSchema>>({
    resolver: zodResolver(billingFormSchema),
    defaultValues: {
      amount: 0,
      category: BillingCategory.OTHER,
      name: "",
      time: new Date(),
      type: BillingType.EXPENSE,
    },
  });

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { isPending, mutate, isError, error } = useMutation({
    mutationFn: (payload: CreateBillingReq) => API_BILLING.CREATE(payload),
    onSuccess: () => {
      billingForm.reset();
      queryClient.invalidateQueries({
        queryKey: ["billings"],
      });
      toast.success("添加成功");
      navigate("/billing");
    },
  });

  const onSubmit = (values: z.infer<typeof billingFormSchema>) => {
    mutate({
      amount: values.amount,
      category: values.category,
      name: values.name,
      time: values.time.toISOString(),
      type: values.type,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl">笨钟账单</h1>
      <div className="flex items-center gap-2">
        <Back to="/billing" />
        <h2 className="text-xl">新增账单</h2>
      </div>
      <Form {...billingForm}>
        <form
          onSubmit={billingForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={billingForm.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>账单类型</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="账单类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BillingType.EXPENSE}>支出</SelectItem>
                      <SelectItem value={BillingType.INCOME}>收入</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={billingForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>账单名称</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="账单名称" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={billingForm.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>账单金额</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="账单金额"
                    value={field.value ? field.value : ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={billingForm.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>账单分类</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="账单分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={BillingCategory.FOOD}>
                        🔴食物
                      </SelectItem>
                      <SelectItem value={BillingCategory.SHOPPING}>
                        🔵购物
                      </SelectItem>
                      <SelectItem value={BillingCategory.TRANSPORT}>
                        🟡交通
                      </SelectItem>
                      <SelectItem value={BillingCategory.ENTERTAINMENT}>
                        🟢娱乐
                      </SelectItem>
                      <SelectItem value={BillingCategory.HEALTH}>
                        🟠健康
                      </SelectItem>
                      <SelectItem value={BillingCategory.EDUCATION}>
                        🟣教育
                      </SelectItem>
                      <SelectItem value={BillingCategory.OTHER}>
                        🟤其他
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={billingForm.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>账单日期</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <CalendarIcon />
                        {field.value ? (
                          format(field.value, "PPP", { locale: zhCN })
                        ) : (
                          <span>请选择日期</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={zhCN}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isError && (
            <Alert variant="destructive">
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isPending}>
            提交
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BillingForm;
