import { atom } from "recoil";


const defaultModalState = {
open: false,
view: 'login'
}

export const modState = atom({
    key: "modalstate",
    default: defaultModalState,
  });
