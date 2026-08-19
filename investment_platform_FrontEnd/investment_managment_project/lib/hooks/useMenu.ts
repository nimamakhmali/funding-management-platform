import { useState } from "react";

export const useMenu = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const openMenu = () => setIsOpenMenu(true);
  const closeMenu = () => setIsOpenMenu(false);
  const toggleMenu = () => setIsOpenMenu((prev) => !prev);

  return {
    isOpenMenu,
    openMenu,
    closeMenu,
    toggleMenu,
  };
};