"use client";

import React, { useState } from "react";
import axios from "axios";

const UpdateNotion = () => {
  const [data, setData] = useState("");

  const updateDatabase = async () => {
    try {
      // Make a POST request to the Notion API to update the database
      const response = await axios.patch(
        `/api`,
        {
          pageId: "",
        },
        {
          headers: {
            method: "GET",
          },
        }
      );

      // Handle the response
      console.log(response.data);
      // ...
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={updateDatabase}>Update Notion Database</button>
    </div>
  );
};

export default UpdateNotion;
