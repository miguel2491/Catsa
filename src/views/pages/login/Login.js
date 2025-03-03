import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter
} from "@coreui/react";
import Cookies from "universal-cookie";
import axios from "axios";
import Swal from "sweetalert2";
import load from "../../../../public/loading.gif";
import { getRol, GetToken } from "../../../Utilidades/Funciones";
import "./Login.css";

// URL base y endpoint
//const baseUrl = "http://apicatsa.catsaconcretos.mx:2543/api/";
const baseUrl = "https://localhost:5001/api/";
export default function Login() {
  // authMode: "login" | "register" | "recover"
  const [authMode, setAuthMode] = useState("login");

  // Para modal de carga
  const [visible, setVisible] = useState(false);

  // Cookies y navegación
  const cookies = new Cookies();
  const navigate = useNavigate();

  // Al montar, revisa si ya hay sesión
  useEffect(() => {
    if (cookies.get("token") && cookies.get("idUsuario")) {
      navigate("/dashboard");
    } else {
      GetToken();
    }
    // eslint-disable-next-line
  }, []);

  // =================================================================
  //             OBTENER TOKEN GENÉRICO
  // =================================================================

  // =================================================================
  //                      INICIAR SESIÓN
  // =================================================================
  async function Sesion(username, password) {
    Swal.fire({
        title: 'Cargando...',
        text: 'Iniciando...',
        didOpen: () => {
            Swal.showLoading();  // Muestra la animación de carga
        }
    });
    // Retornaremos true o false según éxito/fracaso
    setVisible(true); // Mostrar modal de carga
    if (username === "" || password === "") {
      Swal.close();
      Swal.fire("Error", "Revise Usuario/Contraseña y vuelva a intentar", "error");
      setVisible(false);
      return false; 
    }
    try {
      const postData = { usuario: username, pass: password };
      const confi_ax = {
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies.get("token"),
        },
      };
      const response = await axios.post(baseUrl + "Login/GetUsuario", postData, confi_ax);
      const userInfo = response.data;

      if (!userInfo.id) {
        Swal.close();
        Swal.fire("Error", "Usuario/Contraseña incorrecta", "error");
        setVisible(false);
        return false;
      }

      // Guardar cookies
      cookies.set("idUsuario", userInfo.id, { path: "/" });
      cookies.set("Usuario", username, { path: "/" });

      // getRol() de tu lógica
      getRol();

      // Redirige luego de 2 segundos
      setTimeout(() => {
        Swal.close();
        navigate("/dashboard");
      }, 2000);

      return true; // Éxito
    } catch (error) {
      console.error(error);
      Swal.close();
      Swal.fire("Error", "Usuario/Contraseña incorrecta, vuelve a intentar", "error");
      return false;
    } finally {
      setVisible(false);
    }
  }

  // =================================================================
  //                       REGISTRAR USUARIO
  // =================================================================
  async function handleRegisterSubmit(newUser, newEmail, newPassword, confirmNewPassword) {
    if (newPassword !== confirmNewPassword || newPassword.trim() === "") {
      Swal.fire("Error", "Las contraseñas no coinciden o están vacías", "error");
      return false;
    }

    setVisible(true);
    const postData = {
      UserName: newUser,
      Password: newPassword,
      CorreoUser: newEmail
    };

    const config = {
      headers: {
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        Authorization: "Bearer " + cookies.get("token"),
      },
    };

    try {
      // Llamada a la API de registro
      const response = await axios.post(baseUrl + "Login/setUsuario", postData, config);

      if (response.status === 200 || response.status === 201) {
        Swal.fire("Éxito", "Registro exitoso", "success");
        return true;
      } else {
        Swal.fire("Error", "No se pudo registrar el usuario", "error");
        return false;
      }
    } catch (error) {
      console.error("Error registrando usuario:", error);
      Swal.fire("Error", "Ocurrió un problema al registrar", "error");
      return false;
    } finally {
      setVisible(false);
    }
  }

  // =================================================================
  //                       RECUPERAR CONTRASEÑA
  // =================================================================
  async function handleRecoverSubmit(email) {
    // Retornar true o false según éxito/fracaso
    setVisible(true);

    // Validar email vacio
    if (!email || email.trim() === "") {
      Swal.fire("Advertencia", "El correo está vacío", "warning");
      setVisible(false);
      return false;
    }

    try {
      // GET a la API: /Login/SendPass/<correo>
      const config = {
        headers: {
          Authorization: "Bearer " + cookies.get("token"),
        },
      };
      const response = await axios.get(baseUrl + "Login/SendPass/" + email, config);
      // Status 200 => se envió con éxito
      if (response.status === 200) {
        Swal.fire("Éxito", "Te enviamos un correo para restablecer tu contraseña", "success");
        return true;
      } else {
        Swal.fire("Error", "No se pudo enviar el correo", "error");
        return false;
      }
    } catch (error) {
      console.error("Error en recuperar contraseña:", error);
      Swal.fire("Error", "Ocurrió un problema al enviar el correo", "error");
      return false;
    } finally {
      setVisible(false);
    }
  }

  // =================================================================
  //             RENDER DEL MODAL DE CARGA (SPINNER)
  // =================================================================
  const renderLoadingModal = (
    <CModal
      className="mLogin"
      backdrop="static"
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="StaticBackdropExampleLabel"
    >
      <CModalHeader>
        <br />
      </CModalHeader>
      <CModalBody className="centered-content">
        <img src={load} alt="Cargando" width={60} />
        <p>Cargando...</p>
      </CModalBody>
      <CModalFooter />
    </CModal>
  );

  // =================================================================
  //                           RENDER PRINCIPAL
  // =================================================================
  return (
    <div className="back">
      {renderLoadingModal}

      {authMode === "login" && (
        <LoginForm
          onRegister={() => setAuthMode("register")}
          onRecover={() => setAuthMode("recover")}
          onLoginSubmit={Sesion}
        />
      )}

      {authMode === "register" && (
        <RegisterForm
          onLogin={() => setAuthMode("login")}
          onRegisterSubmit={handleRegisterSubmit}
        />
      )}

      {authMode === "recover" && (
        <RecoverForm
          onLogin={() => setAuthMode("login")}
          onRecoverSubmit={handleRecoverSubmit} // <== Pasamos aquí la función
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
                  FORMULARIO DE LOGIN 
   ------------------------------------------------------------------ */
   function LoginForm({ onRegister, onRecover, onLoginSubmit }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    // Clases para la animación
    const [usernameSectionClass, setUsernameSectionClass] = useState(
      "input-section email-section"
    );
    const [passwordSectionClass, setPasswordSectionClass] = useState(
      "input-section password-section folded"
    );
    const [successClass, setSuccessClass] = useState("success");
  
    // Handlers de cambio
    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
  
    // Cuando el usuario presiona la flecha en la sección "usuario"
    const handleUsernameNext = () => {
      setUsernameSectionClass((prev) => prev + " fold-up");
      setPasswordSectionClass("input-section password-section");
    };
  
    // Cuando el usuario presiona la flecha en la sección "contraseña"
    const handlePasswordNext = async () => {
      const isOk = await onLoginSubmit(username, password);
  
      if (isOk) {
        // Si el login fue exitoso => animación de fold-up + "BIENVENIDO"
        setPasswordSectionClass((prev) => prev + " fold-up");
        setSuccessClass("success show");
      } else {
        setUsername("");           
        setPassword("");           
  
        // restauramos las clases para que se muestre la sección de usuario
        setUsernameSectionClass("input-section email-section");
        setPasswordSectionClass("input-section password-section folded");
      }
    };
  
    return (
      <div className="registration-form">
        <header>
          <h1>Inicia sesión</h1>
          <p>Somos CATSA, somos FUTURO</p>
        </header>
  
        <form>
          {/* Sección "usuario" */}
          <div className={usernameSectionClass}>
            <input
              type="text"
              placeholder="Ingresa tu usuario"
              autoComplete="off"
              className="email"
              value={username}
              onChange={handleUsernameChange}
            />
            <div className="animated-button">
              {username.trim() === "" ? (
                <span className="icon-paper-plane">
                  <i className="fa fa-user"></i>
                </span>
              ) : (
                <button
                  type="button"
                  className="next-button email"
                  onClick={handleUsernameNext}
                >
                  <i className="fa fa-arrow-up"></i>
                </button>
              )}
            </div>
          </div>
  
          {/* Sección Password */}
          <div className={passwordSectionClass}>
            <input
              type="password"
              placeholder="Coloca tu contraseña aquí"
              className="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <div className="animated-button">
              {password.trim() === "" ? (
                <span className="icon-lock">
                  <i className="fa fa-lock"></i>
                </span>
              ) : (
                <button
                  type="button"
                  className="next-button password"
                  onClick={handlePasswordNext}
                >
                  <i className="fa fa-arrow-up"></i>
                </button>
              )}
            </div>
          </div>
  
          {/* Mensaje de éxito */}
          <div className={successClass}>
            <p>BIENVENIDO</p>
          </div>
        </form>
  
        {/* Links para cambiar de modo */}
        <span className="togglee-link" onClick={onRegister}>
          ¿No tienes cuenta? Regístrate
        </span>
        <span className="toggle-link" onClick={onRecover}>
          ¿Olvidaste la contraseña?
        </span>
      </div>
    );
  }
  

/* ------------------------------------------------------------------
                 FORMULARIO DE REGISTRO
   ------------------------------------------------------------------ */
function RegisterForm({ onLogin, onRegisterSubmit }) {
  const [newUser, setNewUser] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Clases para animación
  const [usernameSectionClass, setUsernameSectionClass] = useState(
    "input-section username-section"
  );
  const [emailSectionClass, setEmailSectionClass] = useState(
    "input-section email-section folded"
  );
  const [passwordSectionClass, setPasswordSectionClass] = useState(
    "input-section password-section folded"
  );
  const [confirmPassSectionClass, setConfirmPassSectionClass] = useState(
    "input-section confirm-pass-section folded"
  );
  const [successClass, setSuccessClass] = useState("success");

  // Handlers
  const handleUserChange = (e) => setNewUser(e.target.value);
  const handleEmailChange = (e) => setNewEmail(e.target.value);
  const handlePasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPassChange = (e) => setConfirmNewPassword(e.target.value);

  // "Next" para cada paso
  const handleUsernameNext = () => {
    setUsernameSectionClass((prev) => prev + " fold-up");
    setEmailSectionClass("input-section email-section");
  };

  const handleEmailNext = () => {
    setEmailSectionClass((prev) => prev + " fold-up");
    setPasswordSectionClass("input-section password-section");
  };

  const handlePasswordNext = () => {
    setPasswordSectionClass((prev) => prev + " fold-up");
    setConfirmPassSectionClass("input-section confirm-pass-section");
  };

  const handleConfirmPassNext = async () => {
    const success = await onRegisterSubmit(
      newUser,
      newEmail,
      newPassword,
      confirmNewPassword
    );
    if (success) {
      setConfirmPassSectionClass((prev) => prev + " fold-up");
      setSuccessClass("success show");

      // Después de mostrar "¡Registro completado!"
      setTimeout(() => {
        onLogin();
      }, 1500);
    }
  };

  return (
    <div className="registration-form">
      <header>
        <h1>Regístrate</h1>
        <p>Somos CATSA, somos FUTURO</p>
      </header>

      <form>
        {/* Usuario */}
        <div className={usernameSectionClass}>
          <input
            type="text"
            placeholder="Ingresa tu usuario"
            autoComplete="off"
            value={newUser}
            onChange={handleUserChange}
          />
          <div className="animated-button">
            {newUser.trim() === "" ? (
              <span className="icon-paper-plane">
                <i className="fa fa-user"></i>
              </span>
            ) : (
              <button
                type="button"
                className="next-button user"
                onClick={handleUsernameNext}
              >
                <i className="fa fa-arrow-up"></i>
              </button>
            )}
          </div>
        </div>

        {/* Email */}
        <div className={emailSectionClass}>
          <input
            type="email"
            placeholder="Coloca tu correo aquí"
            autoComplete="off"
            value={newEmail}
            onChange={handleEmailChange}
          />
          <div className="animated-button">
            {newEmail.trim() === "" ? (
              <span className="icon-paper-plane">
                <i className="fa fa-envelope-o"></i>
              </span>
            ) : (
              <button
                type="button"
                className="next-button email"
                onClick={handleEmailNext}
              >
                <i className="fa fa-arrow-up"></i>
              </button>
            )}
          </div>
        </div>

        {/* Password */}
        <div className={passwordSectionClass}>
          <input
            type="password"
            placeholder="Crea tu contraseña"
            autoComplete="off"
            value={newPassword}
            onChange={handlePasswordChange}
          />
          <div className="animated-button">
            {newPassword.trim() === "" ? (
              <span className="icon-lock">
                <i className="fa fa-lock"></i>
              </span>
            ) : (
              <button
                type="button"
                className="next-button password"
                onClick={handlePasswordNext}
              >
                <i className="fa fa-arrow-up"></i>
              </button>
            )}
          </div>
        </div>

        {/* Confirmar Password */}
        <div className={confirmPassSectionClass}>
          <input
            type="password"
            placeholder="Repite tu contraseña"
            autoComplete="off"
            value={confirmNewPassword}
            onChange={handleConfirmPassChange}
          />
          <div className="animated-button">
            {confirmNewPassword.trim() === "" ? (
              <span className="icon-lock">
                <i className="fa fa-lock"></i>
              </span>
            ) : (
              <button
                type="button"
                className="next-button confirm"
                onClick={handleConfirmPassNext}
              >
                <i className="fa fa-arrow-up"></i>
              </button>
            )}
          </div>
        </div>

        {/* Mensaje de éxito */}
        <div className={successClass}>
          <p>¡Registro completado!</p>
        </div>
      </form>

      {/* Link para volver al login */}
      <span className="toggle-link" onClick={onLogin}>
        ¿Ya tienes cuenta? Inicia sesión
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ 
                FORMULARIO DE RECUPERACIÓN
   ------------------------------------------------------------------ */
function RecoverForm({ onLogin, onRecoverSubmit }) {
  const [email, setEmail] = useState("");

  // Clases de la sección de email
  const [recoverSectionClass, setRecoverSectionClass] = useState(
    "input-section recover-email-section"
  );

  // Mensaje de éxito
  const [successClass, setSuccessClass] = useState("success");

  const handleEmailChange = (e) => setEmail(e.target.value);

  // Ahora llamamos a onRecoverSubmit (del padre) y, si es true, hacemos fold-up
  const handleRecoverNext = async () => {
    const success = await onRecoverSubmit(email);
    if (success) {
      // Animación y mensaje
      setRecoverSectionClass((prev) => prev + " fold-up");
      setSuccessClass("success show");
    }
    // Si no hay éxito, no plegamos
  };

  return (
    <div className="registration-form">
      <header>
        <h1>Recuperar contraseña</h1>
        <p>Ingresa tu correo para restablecer tu contraseña</p>
      </header>

      <form>
        {/* Sección para capturar el correo */}
        <div className={recoverSectionClass}>
          <input
            type="email"
            placeholder="Escribe tu correo"
            autoComplete="off"
            value={email}
            onChange={handleEmailChange}
          />
          <div className="animated-button">
            {email.trim() === "" ? (
              <span className="icon-paper-plane">
                <i className="fa fa-envelope-o"></i>
              </span>
            ) : (
              <button
                type="button"
                className="next-button recover"
                onClick={handleRecoverNext}
              >
                <i className="fa fa-arrow-up"></i>
              </button>
            )}
          </div>
        </div>

        {/* Mensaje de éxito */}
        <div className={successClass}>
          <p>Te enviamos un correo para restablecer tu contraseña</p>
        </div>
      </form>

      <span className="toggle-link" onClick={onLogin}>
        Volver a iniciar sesión
      </span>
    </div>
  );
}
