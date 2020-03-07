// You probably don't need CRACO and can stay with CRA.
// We use CRACO here because of lerna-react issues resulting in https://fb.me/react-invalid-hook-call
const path = require("path");

module.exports = {
  webpack: {
    alias: {
      react: path.resolve("./node_modules/react"), // if this is removed, https://reactjs.org/warnings/invalid-hook-call-warning.html happens
    },
  },
};
