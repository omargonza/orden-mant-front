import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useToast } from "./context/ToastContext";
import Select from "react-select";
import "./form.css";

const API = import.meta.env.VITE_BACKEND_URL || "";

// 🔹 Agrupaciones de tableros (resumen completo de Ausol)
const tableros = [
  {
    label: "Gral. Paz – Acceso Norte / La Noria",
    options: [
      { value: "TI 1400", label: "TI 1400" },
      { value: "TI 1300", label: "TI 1300" },
      { value: "TI 1200", label: "TI 1200" },
      { value: "TI 1100", label: "TI 1100" },
      { value: "TI 1000", label: "TI 1000" },
      { value: "TI 900", label: "TI 900" },
      { value: "Tablero Cámara 1", label: "Tablero Cámara 1" },
      { value: "Tablero Cámara 2", label: "Tablero Cámara 2" },
      { value: "TI 800", label: "TI 800" },
      { value: "TI 700", label: "TI 700" },
      { value: "TI 600", label: "TI 600" },
      { value: "TI 500", label: "TI 500" },
      { value: "TI 400", label: "TI 400" },
      { value: "TI 300", label: "TI 300" },
      { value: "TI 200", label: "TI 200" },
      { value: "TI 100", label: "TI 100" },
      { value: "TI 47 Provincias Unidas", label: "TI 47 Provincias Unidas" },
      { value: "Tuyuti", label: "Tuyuti" },
      { value: "Ibarrola", label: "Ibarrola" },
      { value: "Amadeo Jacques", label: "Amadeo Jacques" },
      { value: "Madrid", label: "Madrid" },
      { value: "San Cayetano", label: "San Cayetano" },
      { value: "J.J. Paso", label: "J.J. Paso" },
      { value: "San Ignacio", label: "San Ignacio" },
      { value: "Croacia", label: "Croacia" },
    ],
  },
  {
    label: "Acceso Norte – General Paz / Lugones",
    options: [
      { value: "TI 40 Superi", label: "TI 40 Superi" },
      { value: "TI 41 Zapiola", label: "TI 41 Zapiola" },
      { value: "TI 42 Cabildo", label: "TI 42 Cabildo" },
      { value: "TI 43 11 de Septiembre", label: "TI 43 11 de Septiembre" },
      { value: "Tab Grecia", label: "Tab Grecia" },
    ],
  },
  {
    label: "Acceso Norte – Marquez / Bifurcación",
    options: [
      { value: "TI 34 Marquez I", label: "TI 34 Marquez I" },
      { value: "TI 35 Marquez II", label: "TI 35 Marquez II" },
      { value: "TI 32 Rolon I", label: "TI 32 Rolon I" },
      { value: "TI 33 Rolon II", label: "TI 33 Rolon II" },
      { value: "Tab Sucre", label: "Tab Sucre" },
      { value: "TG 093 Gardel", label: "TG 093 Gardel" },
      { value: "TG 099 Carlos Tejedor", label: "TG 099 Carlos Tejedor" },
      { value: "TG 111 Camino Moron", label: "TG 111 Camino Moron" },
      { value: "TGBA03 Buen Aire", label: "TGBA03 Buen Aire" },
      { value: "TGBA05 Ezequiel", label: "TGBA05 Ezequiel" },
      { value: "TG147 Boulogne", label: "TG147 Boulogne" },
      { value: "TG165 Pacheco", label: "TG165 Pacheco" },
      { value: "TG177 Reconquista", label: "TG177 Reconquista" },
      { value: "TG195 Bifurcación", label: "TG195 Bifurcación" },
    ],
  },
  {
    label: "Ramal Campana",
    options: [
      { value: "TC02 Gutiérrez", label: "TC02 Gutiérrez" },
      { value: "TC04 Constituyentes", label: "TC04 Constituyentes" },
      { value: "TC06 Alvear", label: "TC06 Alvear" },
      { value: "TC10 Ruta 9", label: "TC10 Ruta 9" },
      { value: "TC24 Escobar II", label: "TC24 Escobar II" },
      { value: "TC39 Río Luján", label: "TC39 Río Luján" },
      { value: "TC42 Los Cardales", label: "TC42 Los Cardales" },
      { value: "TC58 Campana", label: "TC58 Campana" },
    ],
  },
  {
    label: "Ramal Pilar",
    options: [
      { value: "TP02 Carnot", label: "TP02 Carnot" },
      { value: "TP06 Constituyentes", label: "TP06 Constituyentes" },
      { value: "TP09 Ruta 26", label: "TP09 Ruta 26" },
      { value: "TP14 Los Lagartos", label: "TP14 Los Lagartos" },
      { value: "TP21 Ricchieri", label: "TP21 Ricchieri" },
      { value: "TP27 J.J. Paso", label: "TP27 J.J. Paso" },
      { value: "TP30 Pilar", label: "TP30 Pilar" },
    ],
  },
  {
    label: "Ramal Tigre",
    options: [
      { value: "TT1 Blanco Encalada", label: "TT1 Blanco Encalada" },
      { value: "TT3 Guido", label: "TT3 Guido" },
      { value: "TT6 Avellaneda", label: "TT6 Avellaneda" },
      { value: "TT9 Carupá", label: "TT9 Carupá" },
      { value: "TT12 Tigre Centro", label: "TT12 Tigre Centro" },
    ],
  },
  {
    label: "Estaciones de Peaje",
    options: [
      { value: "Peaje Debenedetti ASC", label: "Peaje Debenedetti ASC" },
      { value: "Peaje Debenedetti DESC", label: "Peaje Debenedetti DESC" },
      { value: "Peaje Márquez ASC", label: "Peaje Márquez ASC" },
      { value: "Peaje Márquez DESC", label: "Peaje Márquez DESC" },
      { value: "Peaje Tigre Troncal", label: "Peaje Tigre Troncal" },
      { value: "Peaje Pilar Troncal", label: "Peaje Pilar Troncal" },
      { value: "Peaje Campana Troncal", label: "Peaje Campana Troncal" },
    ],
  },
];

export default function App() {
  const { showToast } = useToast();
  const [theme, setTheme] = useState("system");

  // 🔄 Tema
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "light") root.classList.remove("dark");
    else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) root.classList.add("dark");
      else root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === "light" ? "dark" : prev === "dark" ? "system" : "light"
    );
  };

  // 🧾 Formulario principal
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      fecha: new Date().toISOString().slice(0, 10),
      ubicacion: "",
      tableros: [],
      circuitos: "",
      vehiculo: "",
      km_inicial: "",
      km_final: "",
      legajos: [{ id: "", nombre: "" }],
      materiales: [],
      tarea_pedida: "",
      tarea_realizada: "",
      tarea_pendiente: "",
      luminaria_equipos: "",
    },
  });

  const legajos = useFieldArray({ control, name: "legajos" });
  const materiales = useFieldArray({ control, name: "materiales" });

  const [backendErrors, setBackendErrors] = useState(null);

  // ✅ Envío al backend
  const onSubmit = async (data) => {
    console.log("Datos que se envían al backend:", data);

    const payload = {
      fecha: data.fecha,
      ubicacion: data.ubicacion,
      tablero:
        Array.isArray(data.tableros) && data.tableros.length > 0
          ? data.tableros[0]
          : "",
      circuito: data.circuitos || "",
      vehiculo: data.vehiculo || "",
      km_inicial: data.km_inicial ? parseFloat(data.km_inicial) : null,
      km_final: data.km_final ? parseFloat(data.km_final) : null,
      tecnicos: (data.legajos || []).map((t) => ({
        legajo: t.id?.toString() || "",
        nombre: t.nombre || "",
      })),
      tarea_pedida: data.tarea_pedida || "",
      tarea_realizada: data.tarea_realizada || "",
      tarea_pendiente: data.tarea_pendiente || "",
      luminaria_equipos: data.luminaria_equipos || "",
      materiales: (data.materiales || []).map((m) => ({
        material: m.material,
        cant: m.cant ? parseFloat(m.cant) : null,
        unidad: m.unidad || "",
      })),
    };

    try {
      showToast("⏳ Generando PDF...", "info");

      const res = await fetch(`${API}/api/ordenes/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        let err;
        try {
          err = JSON.parse(text);
        } catch {
          err = { raw: text };
        }

        console.group("🚨 ERROR DEL BACKEND");
        console.log("📩 Status:", res.status);
        console.log("📨 Respuesta completa:", err);
        console.groupEnd();

        setBackendErrors(err); // 👈 guardamos los errores para mostrarlos en pantalla
        showToast("❌ Error al generar PDF. Revisá los datos.", "error");
        return;
      }

      setBackendErrors(null); // ✅ limpiar errores si el PDF salió bien

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orden_trabajo.pdf";
      a.click();
      URL.revokeObjectURL(url);

      showToast("✅ PDF generado correctamente.", "success");
    } catch (e) {
      console.error("❌ Error de conexión:", e);
      showToast("🚫 No se pudo conectar con el servidor.", "error");
    }
  };

  return (
    <>
      <div className="header-bar">Orden de Trabajo</div>

      <div className="form-container">
        <h1>Orden de Trabajo</h1>

        {/* 🌓 Botón de tema */}
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" && "🌞"}
          {theme === "dark" && "🌙"}
          {theme === "system" && "🖥️"}
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="form-body">
          {/* Datos generales */}
          <section className="section">
            <h3>Datos generales</h3>
            <div className="grid-2">
              <label>
                Fecha
                <input type="date" {...register("fecha")} />
              </label>
              <label>
                Ubicación
                <input type="text" {...register("ubicacion")} />
              </label>
            </div>
          </section>

          {/* Tableros */}
          <section className="section">
            <h3>Tablero y Circuito</h3>
            <label>Tablero</label>
            <Controller
              name="tableros"
              control={control}
              render={({ field }) => (
                <Select
                  isMulti
                  options={tableros}
                  placeholder="Buscar tablero..."
                  value={(field.value || []).map((v) => ({
                    value: v,
                    label: v,
                  }))}
                  onChange={(vals) => field.onChange(vals.map((v) => v.value))}
                />
              )}
            />
            <label>Circuito</label>
            <input
              type="text"
              className="full-input"
              placeholder="FD2, alumbrado exterior…"
              {...register("circuitos")}
            />
          </section>

          {/* Vehículo y km */}
          <section className="section">
            <h3>Vehículo y kilómetros</h3>
            <div className="grid-3">
              <label>
                Vehículo
                <select {...register("vehiculo")}>
                  <option value="">Seleccionar...</option>
                  <option>AB101RS</option>
                  <option>AE026TH</option>
                  <option>AE026VN</option>
                  <option>AF836WI</option>
                  <option>AF078KP</option>
                  <option>AH223LS</option>
                  <option>AA801TV</option>
                </select>
              </label>
              <label>
                Km inicial
                <input type="number" step="0.1" {...register("km_inicial")} />
              </label>
              <label>
                Km final
                <input type="number" step="0.1" {...register("km_final")} />
              </label>
            </div>
          </section>

          {/* Técnicos */}
          <section className="section">
            <h3>Técnicos</h3>
            {legajos.fields.map((f, idx) => (
              <div key={f.id} className="flex-row">
                <input
                  placeholder="Legajo"
                  {...register(`legajos.${idx}.id`)}
                />
                <input
                  placeholder="Nombre"
                  {...register(`legajos.${idx}.nombre`)}
                />
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => legajos.remove(idx)}
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={() => legajos.append({ id: "", nombre: "" })}
            >
              ➕ Agregar técnico
            </button>
          </section>

          {/* Tareas */}
          <section className="section">
            <h3>Tareas</h3>
            <label>Tarea pedida</label>
            <input
              type="text"
              className="full-input"
              placeholder="Ej: Reemplazo de luminarias..."
              {...register("tarea_pedida")}
            />
            <label>Tarea realizada</label>
            <textarea
              rows={4}
              className="full-input"
              {...register("tarea_realizada")}
            />
            <label>Tarea pendiente</label>
            <textarea
              rows={3}
              className="full-input"
              {...register("tarea_pendiente")}
            />
            <label>Luminaria / Equipos encendidos</label>
            <input
              type="text"
              className="full-input"
              placeholder="Ej: NF1562 – 10 columnas encendidas"
              {...register("luminaria_equipos")}
            />
          </section>

          {/* Materiales */}
          <section className="section">
            <h3>Materiales</h3>
            {materiales.fields.map((f, idx) => (
              <div key={f.id} className="grid-4">
                <input
                  placeholder="Material"
                  {...register(`materiales.${idx}.material`)}
                />
                <input
                  placeholder="Cant."
                  type="number"
                  step="0.01"
                  {...register(`materiales.${idx}.cant`)}
                />
                <input
                  placeholder="Unidad"
                  {...register(`materiales.${idx}.unidad`)}
                />
                <button
                  type="button"
                  className="btn-remove"
                  onClick={() => materiales.remove(idx)}
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={() =>
                materiales.append({ material: "", cant: 1, unidad: "unidad" })
              }
            >
              ➕ Agregar material
            </button>
          </section>

          {/* Botones */}
          <div className="btn-group">
            <button type="submit" className="btn-primary">
              📄 Generar PDF
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => reset()}
            >
              🧹 Limpiar
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
