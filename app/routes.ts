import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/layout/MainLayout.tsx", [
    index("routes/home.tsx"),
    route("users", "routes/users.tsx"),
  ]),
  route("login", "routes/login.tsx"),
];
