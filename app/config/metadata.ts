import { Metadata } from "next";
import { siteConfig } from "./site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
}; 