import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { API_BILLING } from "../../apis/billing";
import dayjs from "dayjs";
import PageLoader from "@/components/PageLoader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Delete = () => {
  const { id } = useParams<{ id: string }>();

  const { isPending, data, isError, error } = useQuery({
    queryKey: ["billing", id],
    queryFn: () => API_BILLING.GET(id!),
  });

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    isPending: delIsPending,
    mutate: del,
    isError: delIsError,
    error: delError,
  } = useMutation({
    mutationFn: () => API_BILLING.DELETE(id!),
    onSuccess: () => {
      navigate("/billing");
      queryClient.invalidateQueries({
        queryKey: ["billings"],
      });
    },
  });

  const handleDelete = () => {
    del();
  };

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
      <Dialog
        open
        onOpenChange={(open) => {
          if (!open) {
            navigate(`/billing`);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除帐单</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <Badge>账单类型</Badge>
              <p>{data.data.type}</p>
            </div>
            <div className="flex items-center gap-6">
              <Badge>账单名称</Badge>
              <p>{data.data.name}</p>
            </div>
            <div className="flex items-center gap-6">
              <Badge>账单分类</Badge>
              <p>{data.data.category}</p>
            </div>
            <div className="flex items-center gap-6">
              <Badge>账单日期</Badge>
              <p>{dayjs(data.data.time).format("YYYY-MM-DD")}</p>
            </div>
            <div className="flex items-center gap-6">
              <Badge>创建时间</Badge>
              <p>{dayjs(data.data.createdAt).format("YYYY-MM-DD HH:mm:ss")}</p>
            </div>

            {delIsError && (
              <Alert variant="destructive">
                <AlertTitle>错误</AlertTitle>
                <AlertDescription>{delError.message}</AlertDescription>
              </Alert>
            )}

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={delIsPending}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Delete;
