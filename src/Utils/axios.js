import axios from "axios";
// import { api } from "../utilitis/api";

const hosturl="https://w8cxdwbc-9000.inc1.devtunnels.ms"
const getRequest = async (url, data) => {
    try {
        const response = await axios.get(
            hosturl + url,


            // url == "/compiler/compile" ? compilerApi : api + url,
            {
                params: data
            }
            //   {
            //     headers: {
            //       Authorization: localStorage.getItem("PS"),
            //     },
            //   }
        );
        // console.log(response.data);
        return { success: true, data: response.data };
    } catch (error) {
        // if (error.response && error.response.status === 401) {
        //     navigate("/auth/login");
        // }

        return { success: false, error: error.response.data };
    }
};
const postRequest = async (url, data) => {
    try {
        const response = await axios.post(
           hosturl + url,
            // url == "/compiler/compile" ? compilerApi : api + url,
            // { data: data, role: role }
            data
            //   {
            //     headers: {
            //       Authorization: localStorage.getItem("PS"),
            //     },
            //   }
        );
        return { success: true, data: response.data };
    } catch (error) {
        // if (error.response && error.response.status === 401) {
        //     navigate("/auth/login");
        // }

        return { success: false, error: error.response.data };
    }
};



export { getRequest, postRequest };
