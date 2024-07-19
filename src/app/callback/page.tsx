"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce((acc, item) => {
        if (item) {
          const parts = item.split("=");
          acc[parts[0]] = decodeURIComponent(parts[1]);
        }
        return acc;
      }, {} as Record<string, string>);

    if (hash.access_token) {
      router.replace(`/?access_token=${hash.access_token}`);
    } else {
      router.replace("/");
    }
  }, [router]);

  return <div>Loading...</div>;
};

export default Callback;
