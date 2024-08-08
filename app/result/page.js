"use client";

import RenderResultBlock from "./renderResultBlock";
import ResultBlock from "../components/ResultBlock";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Result() {
  const [pages, setPages] = useState();

  useEffect(() => {
    getPages();
  }, []);

  const getPages = async () => {
    try {
      const response = await axios.get(`/api`);

      console.log("response ===> ", response.data);

      setPages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {pages && (
        <div className="grid md:grid-cols-10 grid-cols-2">
          <RenderResultBlock pages={pages}></RenderResultBlock>
        </div>
      )}
    </>
  );
}
