# Bounty API - Sistema de Recompensas de la Marina

API REST construida con **NestJS** y **MongoDB Atlas** para gestionar piratas y sus carteles de recompensa.

## Tecnologías Utilizadas

- NestJS v11
- MongoDB (Mongoose v9)
- class-validator / class-transformer
- Jest (Unit Testing)

---

## Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- **Node.js** v18 o superior → [Descargar aquí](https://nodejs.org/)
- **npm** (viene incluido con Node.js)
- Una cuenta en **MongoDB Atlas** (o MongoDB local)

Puedes verificar tu versión de Node con:

```bash
node -v
```

---

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd bounty-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
MONGO_URI=mongodb+srv://<USUARIO>:<PASSWORD>@<CLUSTER>.mongodb.net/bounty-api
PORT=3000
```

> **Importante:** Reemplaza `<USUARIO>`, `<PASSWORD>` y `<CLUSTER>` con tus credenciales reales de MongoDB Atlas.

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `MONGO_URI` | URI de conexión a MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/bounty-api` |
| `PORT` | Puerto donde corre el servidor (opcional, default: 3000) | `3000` |

### 4. Iniciar el servidor

```bash
npm run start:dev
```

Si todo está correcto, verás en la terminal:

```
Nest application successfully started
```

El servidor estará disponible en: **http://localhost:3000**

---

## Ejecutar Unit Tests

```bash
npm run test
```

Los tests unitarios del `BountiesService` verifican:

- ✅ El servicio está definido correctamente
- ✅ `findAll()` retorna un arreglo de recompensas
- ✅ `findActive()` filtra solo recompensas con estado "Wanted"
- ✅ `findOne()` retorna una recompensa por ID
- ✅ `findOne()` lanza `NotFoundException` si el ID no existe
- ✅ `create()` crea y retorna una recompensa
- ✅ `update()` actualiza y retorna la recompensa
- ✅ `remove()` elimina y retorna la recompensa
- ✅ Los tests NO se conectan a la base de datos real (usan mocks)

### Captura de tests pasando en verde

![Tests pasando](./screenshots/ssJestTest.png)

---

## Endpoints de la API

### Pirates (Piratas)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/pirates` | Crear un nuevo pirata |
| `GET` | `/pirates` | Listar todos los piratas |
| `GET` | `/pirates/:id` | Obtener un pirata por ID |

**Ejemplo de body para crear un pirata:**

```json
{
  "nombre": "Monkey D. Luffy",
  "tripulacion": "Sombrero de Paja",
  "tieneFrutaDelDiablo": true
}
```

### Bounties (Recompensas)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/bounties` | Crear una nueva recompensa |
| `GET` | `/bounties` | Listar todas las recompensas (con datos del pirata) |
| `GET` | `/bounties/active` | Listar solo recompensas con estado "Wanted" |
| `GET` | `/bounties/:id` | Obtener una recompensa por ID |
| `PATCH` | `/bounties/:id` | Actualizar una recompensa |
| `DELETE` | `/bounties/:id` | Eliminar una recompensa |

**Ejemplo de body para crear una recompensa:**

```json
{
  "cantidadBellys": 3000000000,
  "estado": "Wanted",
  "pirata": "<ID_DEL_PIRATA>"
}
```

> Los valores válidos para `estado` son: `"Wanted"` o `"Captured"`.

---

## Probar con Postman

El repositorio incluye una colección de Postman lista para usar:

📁 **Archivo:** `Bounty-API.postman_collection.json`

### Cómo importarla:

1. Abre **Postman**
2. Click en **Import** (esquina superior izquierda)
3. Selecciona el archivo `Bounty-API.postman_collection.json` de este repositorio
4. La colección aparecerá en tu sidebar con todas las peticiones organizadas

### Orden recomendado para probar:

1. **Crear Pirata** (`POST /pirates`) → se guarda automáticamente el ID del pirata creado
2. **Crear Pirata 2** (`POST /pirates`) → crea un segundo pirata de ejemplo
3. **Listar Piratas** (`GET /pirates`) → verifica que se crearon
4. **Crear Bounty** (`POST /bounties`) → usa el ID del pirata automáticamente
5. **Listar Bounties** (`GET /bounties`) → las recompensas incluyen los datos completos del pirata gracias a `populate`
6. **Listar Bounties Activas** (`GET /bounties/active`) → solo muestra estado "Wanted"
7. **Actualizar Bounty** (`PATCH /bounties/:id`) → cambia el monto o estado
8. **Eliminar Bounty** (`DELETE /bounties/:id`) → elimina la recompensa

---

## Validaciones implementadas

El `ValidationPipe` global rechaza automáticamente datos inválidos:

| Campo | Validación | Qué pasa si falla |
|-------|------------|-------------------|
| `nombre` (pirata) | Requerido, debe ser string | Error 400: "nombre should not be empty" |
| `tripulacion` (pirata) | Requerido, debe ser string | Error 400: "tripulacion should not be empty" |
| `cantidadBellys` (bounty) | Requerido, número positivo | Error 400: "cantidadBellys must be a positive number" |
| `estado` (bounty) | Solo "Wanted" o "Captured" | Error 400: "estado must be a valid enum value" |
| `pirata` (bounty) | Debe ser un MongoId válido | Error 400: "pirata must be a mongodb id" |
| Campos extra no definidos | Rechazados automáticamente | Error 400: "property X should not exist" |

---

## Estructura del Proyecto

```
bounty-api/
├── src/
│   ├── main.ts                          # Punto de entrada + ValidationPipe global
│   ├── app.module.ts                    # Módulo raíz (MongoDB Atlas config)
│   ├── pirates/
│   │   ├── pirates.module.ts            # Módulo de piratas
│   │   ├── pirates.controller.ts        # Endpoints de piratas
│   │   ├── pirates.service.ts           # Lógica de negocio de piratas
│   │   ├── dto/
│   │   │   └── create-pirate.dto.ts     # DTO con validaciones
│   │   └── schemas/
│   │       └── pirate.schema.ts         # Schema de Mongoose
│   └── bounties/
│       ├── bounties.module.ts           # Módulo de recompensas
│       ├── bounties.controller.ts       # Endpoints de recompensas
│       ├── bounties.service.ts          # Lógica de negocio de recompensas
│       ├── bounties.service.spec.ts     # Unit Tests
│       ├── dto/
│       │   ├── create-bounty.dto.ts     # DTO con validaciones
│       │   └── update-bounty.dto.ts     # DTO parcial (PartialType)
│       ├── enums/
│       │   └── bounty-estado.enum.ts    # Enum: Wanted / Captured
│       └── schemas/
│           └── bounty.schema.ts         # Schema de Mongoose con relación a Pirate
├── Bounty-API.postman_collection.json   # Colección de Postman
├── .env                                 # Variables de entorno (no subir a GitHub)
└── package.json
```

