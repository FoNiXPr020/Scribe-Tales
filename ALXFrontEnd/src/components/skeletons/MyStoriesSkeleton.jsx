import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from '@mui/material';

const MyStoriesSkeleton = () => {
  return (
    <Card className="rounded-xl">
      <CardContent className="grid gap-3 mt-4">
        <div className="space-y-1">
          <Skeleton width="60%" height={25} />
        </div>
        <Skeleton variant="rectangular"
          width="100%"
          className="rounded-xl"
          height={window.innerWidth < 600 ? 120 : 150}
        />
        <div>
          <Skeleton width="100%" height={30} />
          <Skeleton width="50%" height={30} />
        </div>
        <div className="grid gap-2 p-2 grid-cols-1 md:grid-cols-3">
          <Skeleton
            className="w-full rounded-xl"
            variant="rectangular"
            height={30}
          />
          <Skeleton
            className="w-full rounded-xl"
            variant="rectangular"
            height={30}
          />
          <Skeleton
            className="w-full rounded-xl"
            variant="rectangular"
            height={30}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MyStoriesSkeleton;
