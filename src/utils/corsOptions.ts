import { allowedOrigins } from "./allowedOrigins";

// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
export const corsOptions = {
  origin: (origin, callback) => {
    // console.log(origin);

    if (
      typeof origin === "undefined" ||
      allowedOrigins.indexOf(origin) !== -1
    ) {
      // Allow requests with undefined origin (e.g., same-origin requests) or if origin is in the allowed list.
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  // allowedHeaders: ["Content-Type", "Authorization"],
  // methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
};
