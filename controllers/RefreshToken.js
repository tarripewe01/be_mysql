import jwt from "jsonwebtoken";

import UserModel from "../models/UserModel.js";

export const RefreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "You are not authenticated" });

  const user = await UserModel.findAll({
    where: { refresh_token: refreshToken },
  });

  if (!user) return res.status(403).json({ message: "Token is not valid" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({ accessToken });
  });
};
