import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CRow
} from '@coreui/react';
import Cookies from "universal-cookie";
import axios from "axios";
import cn from "classnames";
import Swal from "sweetalert2";
import "./login.css";
import load from '../../../../public/loading.gif'

const Login = () => {
  const [switched, setSwitched] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const cookies = new Cookies();
  const navigate = useNavigate();
  const toaster = useRef();

  const baseUrl = "http://apicatsa.catsaconcretos.mx:2543/api/";
  
  useEffect(() => {
    //setVisible(!visible)
    if (cookies.get("token") && cookies.get("idUsuario")) {
      navigate("/dashboard");
    } else {
      GetToken();
    }
  }, []);

  async function GetMenus() {
    try {
      const confi_ax = {
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          Authorization: "Bearer " + cookies.get("token")
        }
      };
      const response = await axios.get(baseUrl + "Login/GetMenus", confi_ax);
      cookies.set("menus", JSON.stringify(response.data), { path: "/" });
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  }

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };

  async function Sesion() {
    setVisible(!visible)
    if (username === "" || password === "") {
      Swal.fire("Error", "Revise Usuario/Contraseña y vuelva a intentar", "error");
      setVisible(visible)
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
        setTimeout(() => { navigate("/dashboard"); },3000)
        
      } catch (error) {
        console.error(error);
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

  return (
    <div className="local-container">
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
      <CModalFooter>                        
      </CModalFooter>
    </CModal>
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
