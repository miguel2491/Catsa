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
import { getRol } from "../../../Utilidades/Funciones";
import "./Login.css";

const baseUrl = "http://apicatsa.catsaconcretos.mx:2543/api/";

export default function Login() {
  // authMode: "login" | "register" | "recover"
  const [authMode, setAuthMode] = useState("login");

  // Para modal de carga
  const [visible, setVisible] = useState(false);

  // Cookies y navegación
  const cookies = new Cookies();
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.get("token") && cookies.get("idUsuario")) {
      navigate("/dashboard");
    } else {
      GetToken();
    }
  }, []);

  // =================== FUNCIONES DE LA LÓGICA ===================

  // Llama al endpoint para obtener token genérico
  async function GetToken() {
    const postData = { UserName: "ProCatsa", Password: "ProCatsa2024$." };
    const confi_ax = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    };
    try {
      const response = await axios.post(baseUrl + "Login/Login", postData, confi_ax);
      cookies.set("token", response.data, { path: "/" });
    } catch (error) {
      console.error("Error obteniendo token", error);
    }
  }

  // Inicia sesión con el backend
  async function Sesion(username, password) {
    if (username === "" || password === "") {
      Swal.fire("Error", "Revise Usuario/Contraseña y vuelva a intentar", "error");
      return;
    }
    Swal.fire({
        title: 'Cargando...',
        text: 'Reedirigiendo...',
        didOpen: () => {
            Swal.showLoading();  // Muestra la animación de carga
            LoginP(username, password)
        }
    });
  }

  const LoginP = async (username, password) => {
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

      cookies.set("idUsuario", userInfo.id, { path: "/" });
      cookies.set("Usuario", username, { path: "/" });
      // getRol() de tu lógica
      getRol();

      // Redirige luego de 2 segundos
      setTimeout(() => {
        Swal.close()
        navigate("/dashboard");
      }, 1000);

    } catch (error) {
      console.error(error);
      Swal.close()
      Swal.fire("Error", "Usuario/Contraseña incorrecta, vuelve a intentar", "error");
    }
  }

  // Registra usuario (ejemplo simple, según tu lógica)
  function handleRegisterSubmit(newUser, newEmail, newPassword, confirmNewPassword) {
    // Validar contraseñas
    if (newPassword !== confirmNewPassword || newPassword.trim() === "") {
      Swal.fire("Error", "Las contraseñas no coinciden o están vacías", "error");
      return;
    }
    // Aquí iría tu llamada a la API de registro (si existe), por ahora un alert
    Swal.fire("Éxito", "Registro exitoso", "success");
  }

  // Render del modal de carga
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

  // =================== RENDER PRINCIPAL ===================
  return (
    <div className="back">
      {renderLoadingModal}

      {authMode === "login" && (
        <LoginForm
          onRegister={() => setAuthMode("register")}
          onRecover={() => setAuthMode("recover")}
          onLoginSubmit={Sesion} // Aquí pasamos la función de login real
        />
      )}

      {authMode === "register" && (
        <RegisterForm
          onLogin={() => setAuthMode("login")}
          onRegisterSubmit={handleRegisterSubmit} // Pasamos la función de registro real
        />
      )}

      {authMode === "recover" && (
        <RecoverForm
          onLogin={() => setAuthMode("login")}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
                  FORMULARIO DE LOGIN
   ------------------------------------------------------------------ */
function LoginForm({ onRegister, onRecover, onLoginSubmit }) {
  // El viejo diseño usaba "username" y "password". 
  // El nuevo decía "email" y "password". 
  // Aquí lo nombramos "username" para que coincida con tu Sesion().
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Clases para la animación
  const [usernameSectionClass, setUsernameSectionClass] = useState(
    "input-section email-section" // Reutilizamos la clase "email-section"
  );
  const [passwordSectionClass, setPasswordSectionClass] = useState(
    "input-section password-section folded"
  );
  const [successClass, setSuccessClass] = useState("success");

  // Handlers
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  // Cuando termina de llenar "usuario" y pasa a "password"
  const handleUsernameNext = () => {
    setUsernameSectionClass((prev) => prev + " fold-up");
    setPasswordSectionClass("input-section password-section");
  };

  // Cuando termina de llenar "password"
  const handlePasswordNext = () => {
    // Aquí podemos llamar la función real de login
    onLoginSubmit(username, password);
    // Animación de éxito local
    setPasswordSectionClass((prev) => prev + " fold-up");
    setSuccessClass("success show");
  };

  return (
    <div className="registration-form">
      <header>
        <h1>Inicia sesión</h1>
        <p>Somos CATSA, somos FUTURO</p>
      </header>

      <form>
        {/* Sección "usuario" (antes "emailSectionClass") */}
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

        {/* Mensaje de éxito (se muestra cuando termina el fold-up) */}
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

  const handleConfirmPassNext = () => {
    // Aquí llamamos la función de registro real (del antiguo diseño)
    onRegisterSubmit(newUser, newEmail, newPassword, confirmNewPassword);

    // Si pasa la validación, plegamos y mostramos éxito
    // TIP: Podrías checar el resultado de la API, pero para simplificar:
    setConfirmPassSectionClass((prev) => prev + " fold-up");
    setSuccessClass("success show");
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
function RecoverForm({ onLogin }) {
  const [email, setEmail] = useState("");

  // Clases de la sección de email
  const [recoverSectionClass, setRecoverSectionClass] = useState(
    "input-section recover-email-section"
  );

  // Mensaje de éxito
  const [successClass, setSuccessClass] = useState("success");

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleRecoverNext = () => {
    if (email.trim() === "") {
      alert("Por favor, ingresa tu correo");
      return;
    }
    // Aquí podrías hacer tu lógica de "recuperar" (enviar correo, etc.)
    // Por ahora, simulamos que funciona
    setRecoverSectionClass((prev) => prev + " fold-up");
    setSuccessClass("success show");
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
