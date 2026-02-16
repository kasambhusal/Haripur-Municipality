"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Maximize,
  Printer,
  FileImage,
  FileType,
  ImageIcon,
} from "lucide-react";
import { useChartExport } from "@/hooks/use-chart-export";
import { useState } from "react";

interface ChartMenuProps {
  elementId: string;
  filename: string;
}

export function ChartMenu({ elementId, filename }: ChartMenuProps) {
  const { downloadSVG, downloadPNG, downloadJPEG, printChart, viewFullscreen } =
    useChartExport();
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadSVG = async () => {
    setIsLoading(true);
    try {
      await downloadSVG({ elementId, filename });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPNG = async () => {
    setIsLoading(true);
    try {
      await downloadPNG({ elementId, filename });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadJPEG = async () => {
    setIsLoading(true);
    try {
      await downloadJPEG({ elementId, filename });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    printChart({ elementId });
  };

  const handleFullscreen = () => {
    viewFullscreen({ elementId });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={isLoading}
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open chart menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleFullscreen}>
          <Maximize className="mr-2 h-4 w-4" />
          View Fullscreen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Chart
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDownloadPNG} disabled={isLoading}>
          <ImageIcon className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Download PNG"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadJPEG} disabled={isLoading}>
          <FileImage className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Download JPEG"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadSVG} disabled={isLoading}>
          <FileType className="mr-2 h-4 w-4" />
          {isLoading ? "Generating..." : "Download SVG"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
