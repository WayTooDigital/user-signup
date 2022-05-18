import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const authToken = req.headers["authorization"];

  if (authToken) {
    try {
      const resp = await jwt.verify(authToken, global.config.jwt_secret);
      res.locals.user_id = resp.id;
    } catch (err) {
      return res.status(403).send({ message: "Failed to validate Auth token" });
    }
  }

  return next();
};

export default authMiddleware;
