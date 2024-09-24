import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from '@mui/material';
import { motion } from "framer-motion";

const MotionCardContentVariant = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

const ExploreSkeleton2 = () => {
  return (
    <motion.div variants={MotionCardContentVariant}>
    <Card className="flex flex-col rounded-2xl">
      <CardHeader className="p-0">
        <Skeleton variant="rectangular" width="100%" height={120} className="rounded-2xl"/>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="flex items-center mb-2">
          <Skeleton variant="circular" width={32} height={32} className="mr-2" />
          <div>
            <Skeleton width={100} height={20} />
            <Skeleton width={60} height={15} />
          </div>
        </div>
        <Skeleton variant="text" width="100%" height={30} />
        <Skeleton variant="text" width="100%" height={30} className="mt-4" />
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <div className="flex items-center">
          <Skeleton variant="circular" width={20} height={20} className="mr-1" />
          <Skeleton width={20} height={15} />
        </div>
        <Skeleton width={50} height={15} />
      </CardFooter>
    </Card>
    </motion.div>
  );
};

export default ExploreSkeleton2;
