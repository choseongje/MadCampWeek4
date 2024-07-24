import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const DynamicHome = dynamic(() => import("../components/Home"), {
  suspense: true,
});

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DynamicHome />
    </Suspense>
  );
}
