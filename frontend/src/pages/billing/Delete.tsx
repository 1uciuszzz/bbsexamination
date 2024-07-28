import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { API_BILLING } from "../../apis/billing";
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import VStack from "../../components/VStack";
import HStack from "../../components/HStack";
import dayjs from "dayjs";
import Back from "../../components/Back";

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

  if (isPending) return <CircularProgress />;

  if (isError) return <Alert severity="error">{error.message}</Alert>;

  return (
    <>
      <Dialog open fullWidth>
        <DialogContent>
          <VStack>
            <HStack>
              <Back to="/billing" />
              <Typography variant="h5">Delete billing</Typography>
            </HStack>

            <HStack>
              <Chip
                label="Type"
                size="small"
                sx={{ borderRadius: 0, width: 96 }}
              />
              <Typography variant="body1">{data.data.type}</Typography>
            </HStack>
            <HStack>
              <Chip
                label="Name"
                size="small"
                sx={{ borderRadius: 0, width: 96 }}
              />
              <Typography variant="body1">{data.data.name}</Typography>
            </HStack>
            <HStack>
              <Chip
                label="Category"
                size="small"
                sx={{ borderRadius: 0, width: 96 }}
              />
              <Typography variant="body1">{data.data.category}</Typography>
            </HStack>
            <HStack>
              <Chip
                label="Time"
                size="small"
                sx={{ borderRadius: 0, width: 96 }}
              />
              <Typography variant="body1">
                {dayjs(data.data.time).format("YYYY-MM-DD HH:mm:ss")}
              </Typography>
            </HStack>
            <HStack>
              <Chip
                label="CreatedAt"
                size="small"
                sx={{ borderRadius: 0, width: 96 }}
              />
              <Typography variant="body1">
                {dayjs(data.data.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </Typography>
            </HStack>

            {delIsError && <Alert severity="error">{delError.message}</Alert>}

            <Button
              variant="outlined"
              color="error"
              onClick={handleDelete}
              disabled={delIsPending}
            >
              Delete
            </Button>
          </VStack>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Delete;
