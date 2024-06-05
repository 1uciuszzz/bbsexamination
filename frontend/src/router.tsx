import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import(`./App.tsx`)).default,
    }),
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import(`./pages/home/Page.tsx`)).default,
        }),
      },
      {
        path: "me",
        lazy: async () => ({
          Component: (await import(`./pages/profile/Page.tsx`)).default,
        }),
      },
      {
        path: "billing",
        lazy: async () => ({
          Component: (await import(`./pages/billing/Page.tsx`)).default,
        }),
        children: [
          {
            path: "",
            lazy: async () => ({
              Component: (await import(`./pages/billing/List.tsx`)).default,
            }),
            children: [
              {
                path: "delete/:id",
                lazy: async () => ({
                  Component: (await import(`./pages/billing/Delete.tsx`))
                    .default,
                }),
              },
            ],
          },
          {
            path: "create",
            lazy: async () => ({
              Component: (await import(`./pages/billing/Create.tsx`)).default,
            }),
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    lazy: async () => ({
      Component: (await import(`./pages/auth/Page.tsx`)).default,
    }),
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import(`./pages/auth/Login.tsx`)).default,
        }),
      },
      {
        path: "register",
        lazy: async () => ({
          Component: (await import(`./pages/auth/Register.tsx`)).default,
        }),
      },
    ],
  },
]);
