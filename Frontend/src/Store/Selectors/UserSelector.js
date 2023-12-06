// import { selector } from "recoil";
// import { jwtDecode } from "jwt-decode";

// export const userLoginSelector = selector({
//   key: "userLoginSelector",
//   get: () => {
//     let ValidUser = undefined;
//     const isLocalStorageAvailable =
//       typeof window !== "undefined" && window.localStorage;
//     let storedUser = isLocalStorageAvailable
//       && localStorage.getItem("user")
//     if (storedUser) {
//       storedUser = JSON.parse(storedUser);
//       const token = storedUser.token;
//       const decoded = jwtDecode(token);
//       const expiresAt = new Date(decoded.exp * 1000);
//       if (new Date() > expiresAt) {
//         localStorage.removeItem("user");
//       } else {
//         ValidUser = storedUser;
//       }
//         return ValidUser
//     }
//     return ValidUser;
//   },
// });
