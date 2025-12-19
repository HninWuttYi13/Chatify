import { useEffect, useState } from "react";
export const useContextMenu = ()=> {
    const [menu, setMenu] = useState(null);
    const openMenu = (e, payload)=> {
        e.preventDefault();
       setMenu({
        x: e.clientX,
        y: e.clientY,
        payload
       })

    };
    const closeMenu = ()=> setMenu(null);
    useEffect(()=> {
        window.addEventListener("click", closeMenu);
        return ()=> window.removeEventListener("click", closeMenu)
    }, [])
    return {
        menu,
        openMenu, 
        closeMenu,
        setMenu
    }
}