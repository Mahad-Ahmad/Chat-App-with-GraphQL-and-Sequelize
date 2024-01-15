import jwt from "jsonwebtoken";

module.exports = (context) => {
  let token;

  if (context.req?.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  } else if (context.connectionParams?.Authorization) {
    token = context.connectionParams.Authorization.split("Bearer ")[1];
  }

  if (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    context.user = decodedToken;
  }

  return context;
};
