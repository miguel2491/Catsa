import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CToast,
  CToastBody,
  CToastClose,
  CToastHeader,
  CToaster
} from '@coreui/react';
import Cookies from "universal-cookie";
import axios from "axios";
import cn from "classnames";
import "./login.css";

const Login = () => {
  const [switched, setSwitched] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toast, addToast] = useState(0);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const toaster = useRef();

  const baseUrl = "http://apicatsa.catsaconcretos.mx:2543/api/";

  useEffect(() => {
    if (cookies.get("token") && cookies.get("idUsuario")) {
      navigate("/panel");
    } else {
      GetToken();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };

  async function Sesion() {
    if (username === "" || password === "") {
      addToast(exampleToast);
    } else {
      try {
        const postData = { usuario: username, pass: password };
        const confi_ax = {
          headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/json",
            Authorization: "Bearer " + cookies.get("token")
          }
        };
        const response = await axios.post(
          baseUrl + "Login/GetUsuario",
          postData,
          confi_ax
        );
        const userInfo = response.data;
        cookies.set("idUsuario", userInfo.id, { path: "/" });
        cookies.set("Usuario", username, { path: "/" });
        navigate("/panel");
      } catch (error) {
        console.error(error);
        addToast(exampleToast);
      }
    }
  }

  async function GetToken() {
    const postData = { UserName: "ProCatsa", Password: "ProCatsa2024$." };
    const confi_ax = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      }
    };
    try {
      const response = await axios.post(baseUrl + "Login/Login", postData, confi_ax);
      cookies.set("token", response.data, { path: "/" });
    } catch (error) {
      console.error(error);
      addToast(exampleToast);
    }
  }

  const exampleToast = (
    <CToast title="CoreUI for React.js">
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill="#007aff"></rect>
        </svg>
        <strong className="me-auto">CoreUI for React.js</strong>
        <small>7 min ago</small>
      </CToastHeader>
      <CToastBody>¡Credenciales incorrectas!</CToastBody>
    </CToast>
  );

  return (
    <div className="local-container">
      <CToaster ref={toaster} push={toast} placement="top-end" />
      <div className={cn("demo", { "s--switched": switched })}>
        <div className="demo__inner">
          <div className="demo__forms">
            <div className="demo__form">
              <div className="demo__form-content">
                <form className="form" onSubmit={(e) => { e.preventDefault(); Sesion(); }}>
                  <div className="form__heading">Bienvenido</div>
                  <label className="form__field">
                    <span className="form__field-label">Usuario</span>
                    <input
                      className="form__field-input"
                      name="username"
                      type="text"
                      onChange={handleChange}
                      value={username}
                      autoComplete="username"
                      placeholder="Usuario"
                    />
                  </label>
                  <label className="form__field">
                    <span className="form__field-label">Contraseña</span>
                    <input
                      className="form__field-input"
                      name="password"
                      type="password"
                      onChange={handleChange}
                      value={password}
                      autoComplete="current-password"
                      placeholder="Contraseña"
                    />
                  </label>
                  <button type="submit" className="form__submit">
                    Iniciar sesión
                  </button>
                </form>
              </div>
            </div>
            <div className="demo__form">
              <div className="demo__form-content">
                <form className="form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form__heading">Siéntete como en casa</div>
                  {["Usuario", "Correo", "Contraseña", "Repite tu contraseña"].map((field) => (
                    <label className="form__field" key={field}>
                      <span className="form__field-label">{field}</span>
                      <input className="form__field-input" type="text" placeholder={field} />
                    </label>
                  ))}
                  <button type="submit" className="form__submit">
                    Registrarse
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="demo__switcher">
            <div className="demo__switcher-inner">
              <div className="demo__switcher-content">
                <div className="demo__switcher-text">
                  <div>
                    <h3>¿Eres nuevo?</h3>
                    <p>Regístrate para obtener todos los recursos disponibles.</p>
                  </div>
                  <div>
                    <h3>¿Ya eres parte?</h3>
                    <p>Inicia sesión y maneja todos los recursos disponibles a tu gusto.</p>
                  </div>
                </div>
                <button
                  className="demo__switcher-btn"
                  onClick={() => setSwitched(!switched)}
                >
                  <span className="animated-border" />
                  <span className="demo__switcher-btn-inner">
                    <span>Registro</span>
                    <span>Iniciar</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
