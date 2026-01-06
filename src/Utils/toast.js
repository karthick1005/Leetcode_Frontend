
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const showsuccessalert = (message) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2 * 1000,
  });
};
export const showerror = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2 * 1000,
  });
};
