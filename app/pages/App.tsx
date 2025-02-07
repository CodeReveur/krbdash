"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const App = () => {
  const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
  const showSideBar = () => {
    setIsOpen(!isOpen);
  }
 const closeSideBar = () => {
  setIsOpen(false);
 }
 useEffect(() => {
  const session = JSON.parse(localStorage.getItem('studentSession') || 'null');
  
  if (!session) {
     router.push("/auth/login");
  }
}, [router]); 

  return (
    <>
     
    </>
  );
}
export default App;