import UserModel from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  const { name, email, password } = req.body;

  // if (password !== confirmPassword) {
  //   res.status(400).json({ message: "Password doesn't match" });
  // }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });
    res.json({ msg: "Register Success" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "20s",
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    await UserModel.update(
      { refreshToken: refreshToken },
      {
        where: { id: user.id },
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await UserModel.update(
      { name, email, password: hashedPassword },
      {
        where: { id },
      }
    );
    res.status(200).json({ msg: "Update Success" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await UserModel.destroy({
      where: { id },
    });
    res.status(200).json({ msg: "Delete Success" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
