import React from "react";
import { redirect } from "next/navigation";

const Home = () => {
  redirect("/permissions");
};

export default Home;
