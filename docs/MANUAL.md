# Manual de Uso - FE Connect (FCT Manager)

¡Bienvenido a **FE Connect**! Esta herramienta ha sido diseñada para facilitar la gestión integral de las Prácticas en Empresa (FCT) de tus alumnos, desde la primera toma de contacto con las empresas hasta el seguimiento final.

---

## 🚀 Inicio Rápido: Primeros Pasos

1.  **Configura el Tutor**: Ve a **Ajustes** y rellena tu nombre, email y el nombre del Ciclo Formativo. Esto se usará en todos los correos automáticos.
2.  **Importa tus Alumnos**: Si tienes un listado en formato Aules o un CSV propio, impórtalo desde la sección **Alumnos**.
3.  **Registra Empresas**: Añade las empresas colaboradoras en la sección **Empresas**.

---

## 👨‍🎓 Gestión de Alumnos

En esta sección puedes llevar el control total de tus estudiantes.

### Importación de Datos
El sistema es compatible con dos formatos principales:
*   **Formato Aules**: Exporta el listado de alumnos de tu curso en Aules (CSV) e impórtalo directamente.
*   **Formato FE Connect**: Formato completo que incluye teléfonos y fotos.

> [!TIP]
> **Privacidad**: Todas las fotos se almacenan localmente en tu ordenador mediante una base de datos profesional (SQLite). Nada se sube a la nube.

### Exportación
Puedes exportar el listado a CSV en cualquier momento. Al hacerlo, el sistema te preguntará si quieres incluir las imágenes (útil para copias de seguridad rápidas en formato Excel).

---

## 🏢 Directorio de Empresas

Lleva un registro de quién acepta alumnos y quién no.

### Estados de Colaboración
Para cada curso académico, puedes marcar a las empresas como:
*   **Sin contactar**: Estado inicial.
*   **Prospección**: Ya les has enviado el primer correo de contacto.
*   **Acepta**: Han confirmado que quieren alumnos este curso.
*   **No acepta**: Han rechazado la colaboración este curso.

---

## 💼 Asignación de Prácticas (Placements)

Aquí es donde conectas a los alumnos con las empresas.

1.  Pulsa en **"Asignar Práctica"**.
2.  Selecciona al alumno y la empresa.
3.  Indica las fechas de inicio, fin y el total de horas.
4.  Asigna un **Tutor/Profesor** para el seguimiento.

---

## 📧 Comunicaciones Automáticas

Ahorra tiempo enviando correos personalizados con un solo clic. El sistema genera borradores automáticos para:
*   **Prospección**: Presentar el ciclo a nuevas empresas.
*   **Inicio de FCT**: Enviar los datos del alumno asignado a la empresa.
*   **Fin de FCT**: Recordar la entrega de documentación al finalizar las prácticas.

---

## ⚙️ Ajustes y Copias de Seguridad

### Backup XML (Muy Importante)
Aunque los datos se guardan automáticamente en tu equipo, te recomendamos descargar un **Backup XML** periódicamente desde Ajustes. Este archivo contiene **TODO** (alumnos, fotos, empresas, histórico de años anteriores) y te permite restaurar el sistema en otro ordenador.

### Gestión de Profesores
Añade a tus compañeros de departamento para poder asignarlos como tutores de seguimiento en las prácticas.

---

## 🛠️ Notas Técnicas
*   **Base de datos**: Local (SQLite).
*   **Tecnología**: React + Node.js.
*   **Seguridad**: Los correos no se envían solos; el sistema abre tu gestor de correo predeterminado (Outlook, Gmail, etc.) con el borrador ya listo para que tú lo revises y lo envíes.

---
*Manual generado para FE Connect v1.5 - 2026*
