"use client";
import { useEffect } from "react";

function ClearStorage() {
  useEffect(() => {
    localStorage.clear();
    fetch("/api/unset-has-loaded-cookie");
  }, []);

  return <p>Storage Cleared</p>;
}

export default ClearStorage;
