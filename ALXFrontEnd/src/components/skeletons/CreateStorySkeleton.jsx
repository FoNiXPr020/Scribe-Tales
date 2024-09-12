import React from "react";
import { Skeleton, Box, Grid, Typography, Button } from "@mui/material";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const CreateStorySkeleton = () => {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-12">
        <div className="container px-2 md:px-6">
          <div className="mx-auto text-center">
            <Typography
              variant="h1"
              component="h1"
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mx-auto"
            >
              <Skeleton variant="text" width="90%" className="mx-auto" />
            </Typography>
            <Typography
              variant="body1"
              className="mt-4 text-muted-foreground md:text-xl mx-auto"
            >
              <Skeleton variant="text" width="85%" className="mx-auto" />
              <Skeleton variant="text" width="60%" className="mx-auto" />
            </Typography>
          </div>
          <div className="mt-12 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton variant="text" width="60%" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton variant="text" width="80%" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="grid gap-4">
                    <Skeleton variant="rectangular" height={40} />
                    <Skeleton
                      variant="rectangular"
                      height={80}
                      className="mt-4"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <Skeleton variant="rectangular" height={40} />
                      <Skeleton variant="rectangular" height={40} />
                      <Skeleton variant="rectangular" height={40} />
                    </div>
                    <Skeleton
                      variant="rectangular"
                      height={40}
                      className="mt-4"
                    />
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="flex-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <Skeleton variant="text" width="60%" />
                  </CardTitle>
                  <CardDescription>
                    <Skeleton variant="text" width="80%" />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <Skeleton variant="rectangular" width="100%" height={360} />
                    <Typography variant="h6" className="mt-4">
                      <Skeleton variant="text" width="60%" />
                    </Typography>
                    <Typography variant="body2" className="mt-1">
                      <Skeleton variant="text" width="80%" />
                    </Typography>
                    <Skeleton
                      variant="rectangular"
                      height={40}
                      className="mt-4"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CreateStorySkeleton;
