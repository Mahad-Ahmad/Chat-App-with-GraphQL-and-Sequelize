import jwt from "jsonwebtoken";

module.exports = (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  } else if (
    context.connectionParams &&
    context.connectionParams.Authorization
  ) {
    token = context.connectionParams.Authorization.split("Bearer ")[1];
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      context.user = decodedToken;
    });
  }
  return context;
};
