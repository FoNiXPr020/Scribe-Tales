import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from '@mui/material';
import { motion } from "framer-motion";

const MotionCardContentVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const ExploreSkeleton = () => {
  return (
    <motion.div variants={MotionCardContentVariant}>
    <Card className="rounded-xl">
      <CardContent className="grid gap-4 mt-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div>
            <Skeleton width={100} height={20} />
            <Skeleton width={60} height={15} />
          </div>
        </div>
        <Skeleton variant="rectangular" width="100%" height={100} />
        <div className="space-y-1">
          <Skeleton width="60%" height={25} />
          <Skeleton width="100%" height={30} />
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default ExploreSkeleton;
