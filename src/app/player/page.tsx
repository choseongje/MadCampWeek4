import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const DynamicPlayerPage = dynamic(() => import("../../components/PlayerPage"), {
  suspense: true,
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicPlayerPage />
    </Suspense>
  );
}
