"use client"
import { useState } from "react";
import Auth from "@/app/Auth/page";
import Home from "@/app/Home/page";

export default function main() {
  const [isAuth,setAuth] = useState(false)
  return (
  isAuth ? (
  <div>
    <Home/>
  </div>
  ) : (
  <Auth setAuth={setAuth} />
  )
  )
}