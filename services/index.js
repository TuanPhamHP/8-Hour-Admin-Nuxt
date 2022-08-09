import axios from "axios"
import user from "./user"
import annoucement from "./annoucement"
import chat from "./chat"
import users from "./users"
import noti from "./noti"
import positions from "./positions"
import companies from "./companies"
import departments from "./departments"
import applications from "./applications"
import userGroup from "./userGroup"

// const axiosInstance = axios.create()
// console.log(axiosInstance.defaults.headers.common)
const services = ((axios) => {
  return {
    user: user(axios),
    users: users(axios),
    userGroup: userGroup(axios),
    noti: noti(axios),
    chat: chat(axios),
    positions: positions(axios),
    companies: companies(axios),
    departments: departments(axios),
    applications: applications(axios),
    annoucement: annoucement(axios),
  }
})(axios)
export default services
