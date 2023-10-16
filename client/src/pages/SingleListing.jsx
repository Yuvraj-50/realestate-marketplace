import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function SingleListing() {
  const params = useParams();
  const getData = async () => {
    const response = await fetch(`/api/v1/listing/${params.id}`);

    const data = await response.json();

    console.log(data);
  };

  useEffect(() => {
    getData();
  });

  return <div>SingleListing</div>;
}

export default SingleListing;
