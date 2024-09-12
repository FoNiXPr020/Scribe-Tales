import React from 'react';
import { Skeleton } from '@mui/material';
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardSkeleton = () => {
  return (
    <main>
      {/* Cover Image Skeleton */}
      <div className="relative h-[180px] overflow-hidden rounded-b-xl md:h-[280px]">
        <Skeleton variant="rectangular" width="100%" height="100%" />
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full bg-background/50 text-muted-foreground hover:bg-background md:bottom-6 md:right-6"
          disabled
        >
          <Skeleton variant="circular" width={24} height={24} />
        </Button>
      </div>

      {/* Profile and Actions Skeleton */}
      <div className="container mx-auto mt-2 max-w-6xl px-4 md:mt-10 md:px-6 grid md:grid-cols-3 gap-8">
        <div>
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Skeleton variant="circular" width={144} height={144} />
            </div>
            <Skeleton width="60%" height={32} style={{ margin: 'auto' }} />
            <Skeleton width="40%" height={24} style={{ margin: 'auto' }} />
            <div className="mt-4 flex justify-center gap-4">
              <Skeleton variant="rectangular" width={160} height={35} />
            </div>
          </div>
        </div>

        {/* Tabs and Cards Skeleton */}
        <div className="md:col-span-2">
          <div className="w-full">
            <div className="grid w-full grid-cols-2 md:grid-cols-2 gap-2">
              <Skeleton width="100%" height={48} />
              <Skeleton width="100%" height={48} />
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-4">
              {Array.from(new Array(2)).map((_, index) => (
                <Card key={index} className="group rounded-xl">
                  <CardContent className="p-4">
                    <Skeleton width="60%" height={28} />
                    <Skeleton width="30%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={225} className="mt-4" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton width="80%" height={20} />
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-5 flex justify-center items-center text-sm text-muted-foreground">
              <Skeleton variant="rectangular" width={150} height={36} />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections Skeleton */}
      <div className="container mx-auto mt-12 max-w-4xl px-4 md:mt-16 md:px-6 mb-12">
        <div className="space-y-8">
          <Skeleton width="40%" height={36} />
          <Skeleton width="60%" height={24} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
            {Array.from(new Array(3)).map((_, index) => (
              <Card key={index} className="group rounded-xl">
                <CardContent className="mt-5">
                  <Skeleton width="80%" height={28} />
                  <Skeleton width="50%" height={28} />
                  <Skeleton variant="rectangular" width="100%" height={225} className="mt-4" />
                </CardContent>
                <CardFooter>
                  <Skeleton width="80%" height={20} />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardSkeleton;
