import { registerViewComponent } from "@frui.ts/views";
import { Link, Outlet } from "@tanstack/react-router";
import { Observer } from "mobx-react-lite";
import React from "react";
import HomeViewModel from "./homeViewModel";

export const HomeView = registerViewComponent(HomeViewModel, vm => {
  const linkProps = {
    activeProps: { style: { color: "red" } },
    activeOptions: {
      exact: true,
    },
  };

  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/" {...linkProps}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/invoices" {...linkProps}>
                Invoices
              </Link>
              <ul>
                <li>
                  <Link to="/invoices/$invoiceId" params={{ invoiceId: "4" }} {...linkProps}>
                    Invoice 4
                  </Link>
                </li>
                <li>
                  <Link to="/invoices/$invoiceId" params={{ invoiceId: "5" }} {...linkProps}>
                    Invoice 5
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/customers" {...linkProps}>
                Customers
              </Link>
              <ul>
                <li>
                  <Link to="/customers" search={{ name: "abc" }} {...linkProps}>
                    Customers search
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/settings" {...linkProps}>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <Observer>
        {() => (
          <h1>
            Navigation app <small>({vm.counter})</small>{" "}
          </h1>
        )}
      </Observer>

      <Outlet />
    </div>
  );
});
