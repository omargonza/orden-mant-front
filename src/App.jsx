// frontend/src/App.jsx
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const tableros = [
  { label: "Gral. Paz – La Noria", options: [
    { value: "Gral. Paz – TI 1400", label: "Gral. Paz – TI 1400" },
    { value: "Gral. Paz – TI 1300", label: "Gral. Paz – TI 1300" },
    { value: "Gral. Paz – TI 1200", label: "Gral. Paz – TI 1200" },
    { value: "Gral. Paz – TI 1100", label: "Gral. Paz – TI 1100" },
    { value: "Gral. Paz – TI 1000", label: "Gral. Paz – TI 1000" },
    { value: "Gral. Paz – TI 900",  label: "Gral. Paz – TI 900"  },
    { value: "Gral. Paz – Tablero Cámara 1", label: "Gral. Paz – Tablero Cámara 1" },
    { value: "Gral. Paz – Tablero Cámara 2", label: "Gral. Paz – Tablero Cámara 2" },
    // ...seguí completando el resto que ya pasaste
  ]},
  { label: "Acceso Norte – Márquez", options: [
    { value: "Márquez – TI 34 Marquez I", label: "Márquez – TI 34 Marquez I" },
    { value: "Márquez – TI 35 Marquez II", label: "Márquez – TI 35 Marquez II" },
    { value: "Márquez – TI 32 Rolon I", label: "Márquez – TI 32 Rolon I" },
    { value: "Márquez – TI 33 Rolon II", label: "Márquez – TI 33 Rolon II" },
    // ...
  ]},
  // Ramal Campana, Pilar, Tigre, etc. (como ya hablamos)
];

export default function App() {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      fecha: new Date().toISOString().slice(0, 10),
      centro_costos: "",
      ubicacion: "",
      tipo_mantenimiento: "Correctivo",
      prioridad: "Normal",

      // 🟢 título y descripción
      tarea: "",
      observaciones: "",

      // 🟢 nuevos
      tableros: [],
      circuitos: "",

      hora_inicio: "08:00",
      hora_fin: "12:00",
      legajos: [{ id: "7023", nombre: "Técnico 1" }],
      materiales: [],
    },
  });

  const legajos = useFieldArray({ control, name: "legajos" });
  const materiales = useFieldArray({ control, name: "materiales" });

  const onSubmit = async (data) => {
    try {
      const res = await fetch(`${API}/api/ordenes/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) return alert("Error al generar PDF");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "orden_trabajo.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("No se pudo conectar con el servidor.");
    }
  };

  const box = { border: "1px solid #ddd", padding: 12, marginBottom: 12, borderRadius: 8 };

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", fontFamily: "system-ui", padding: 10 }}>
      <h1>Orden de Trabajo</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Datos generales */}
        <div style={box}>
          <h3>Datos generales</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label>Fecha<br /><input type="date" {...register("fecha")} /></label>
            <label>Centro de costos<br /><input type="text" {...register("centro_costos")} /></label>
            <label>Ubicación<br /><input type="text" {...register("ubicacion")} /></label>
            <label>Tipo de mantenimiento<br />
              <select {...register("tipo_mantenimiento")}>
                <option>Preventivo</option>
                <option>Correctivo</option>
                <option>Obras nuevas</option>
              </select>
            </label>
            <label>Prioridad<br />
              <select {...register("prioridad")}>
                <option>Normal</option>
                <option>Urgente</option>
              </select>
            </label>
          </div>
        </div>

        {/* Título de la tarea */}
        <div style={box}>
          <h3>Título de la tarea</h3>
          <input type="text" placeholder="Ej: Cambio de alimentador" {...register("tarea")} />
        </div>

        {/* Descripción de la tarea */}
        <div style={box}>
          <h3>Descripción de la tarea</h3>
          <textarea rows={6} placeholder="Describa las acciones realizadas..." {...register("observaciones")} />
        </div>

        {/* Tableros y Circuito */}
        <div style={box}>
          <h3>Tablero(s) y Circuito</h3>
          <label>Tablero(s) intervenido(s)</label>
          <Controller
            name="tableros"
            control={control}
            render={({ field }) => (
              <Select
                isMulti
                options={tableros}
                placeholder="Buscar tablero..."
                value={(field.value || []).map(v => ({ value: v, label: v }))}
                onChange={(vals) => field.onChange(vals.map(v => v.value))}
              />
            )}
          />
          <br />
          <label>Circuito</label>
          <input type="text" placeholder="FD2, alumbrado exterior…" {...register("circuitos")} />
        </div>

        {/* Horarios y técnicos */}
        <div style={box}>
          <h3>Horarios y Técnicos</h3>
          <label>Hora inicio<br /><input type="time" {...register("hora_inicio")} /></label>
          <label style={{ marginLeft: 12 }}>Hora fin<br /><input type="time" {...register("hora_fin")} /></label>
          <h4>Legajos</h4>
          {legajos.fields.map((f, idx) => (
            <div key={f.id} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <input placeholder="ID" {...register(`legajos.${idx}.id`)} />
              <input placeholder="Nombre" {...register(`legajos.${idx}.nombre`)} />
              <button type="button" onClick={() => legajos.remove(idx)}>❌</button>
            </div>
          ))}
          <button type="button" onClick={() => legajos.append({ id: "", nombre: "" })}>➕ Agregar legajo</button>
        </div>

        {/* Materiales */}
        <div style={box}>
          <h3>Materiales</h3>
          {materiales.fields.map((f, idx) => (
            <div key={f.id} style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px auto", gap: 8, marginBottom: 6 }}>
              <input placeholder="Material" {...register(`materiales.${idx}.material`)} />
              <input placeholder="Cant." type="number" step="0.01" {...register(`materiales.${idx}.cant`)} />
              <input placeholder="Unidad" {...register(`materiales.${idx}.unidad`)} />
              <button type="button" onClick={() => materiales.remove(idx)}>❌</button>
            </div>
          ))}
          <button type="button" onClick={() => materiales.append({ material: "", cant: 1, unidad: "un" })}>➕ Agregar material</button>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button type="submit">📄 Generar PDF</button>
          <button type="button" onClick={() => reset()}>🧹 Limpiar</button>
        </div>
      </form>
    </div>
  );
}

