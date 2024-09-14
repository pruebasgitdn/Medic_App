export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJWT();

  const cookieName =
    user.role === "admin"
      ? "adminToken"
      : user.role === "paciente"
      ? "patientToken"
      : user.role === "doctor"
      ? "doctorToken"
      : "usertoken";

  /*
  Mandamos la res.status
.cookie => crea la cookie para la peticion
  */
  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(Date.now() + parseInt(process.env.COOKIE_EXPIRE)),
    })

    /*
    Devolvemos el mensaje user y su token
    */
    .json({
      succes: true,
      message,
      user,
      token,
    });
};
