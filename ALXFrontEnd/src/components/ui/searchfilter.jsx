"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "@/components/ui/Icons";
import { Search as SearchIcon, X } from "lucide-react";

export const Search = ({
  SearchQuery,
  setSearchQuery,
  placeholder,
  ...props
}) => {
  return (
    <div className="relative w-full flex items-center gap-1">
      <SearchIcon className="absolute left-4 top-3 text-muted-foreground h-4 w-4" />
      <Input
        className="flex-1 rounded-full pl-12"
        placeholder={placeholder || "Search..."}
        value={SearchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        {...props}
      />
      {SearchQuery !== "" && (
        <X
          className="absolute right-4 top-3 text-muted-foreground h-4 w-4 cursor-pointer hover:text-orange-500"
          onClick={() => setSearchQuery("")}
        />
      )}
    </div>
  );
};

export const Filter = ({ sortOrder, setSortOrder }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-1 rounded-full">
          <FilterIcon className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 rounded-xl">
        <DropdownMenuLabel>Sort by </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup onValueChange={setSortOrder} value={sortOrder}>
          <DropdownMenuRadioItem value="newest">Newest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="category">
            Category
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};