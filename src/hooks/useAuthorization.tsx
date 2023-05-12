import { useEffect, useState } from "react"
import { useGetUserMenuList } from "./userMenu"
import { useLocation } from "react-router-dom";

export const useAuthorization = () => {
  const { data: userMenu } = useGetUserMenuList();
  const pathNameSplitted = useLocation().pathname.split('/');
  const pathName = pathNameSplitted[pathNameSplitted.length - 1];
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    userMenu?.data.forEach((menuItem) => {
      if(menuItem.childs?.length){
        menuItem.childs.forEach((childMenu) => {
          if(childMenu.id === pathName){
            setShowDelete(!!childMenu.delete);
            setShowUpdate(!!childMenu.update);
            setShowCreate(!!childMenu.create);
          }
        })
      }
    })
  }, [pathName, userMenu])

  return {
    showDelete,
    showUpdate,
    showCreate
  }
}
