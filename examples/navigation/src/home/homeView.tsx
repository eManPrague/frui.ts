import { registerViewComponent } from "@frui.ts/views";
import { Link, Outlet } from "@tanstack/react-location";
import { Observer } from "mobx-react-lite";
import React from "react";
import HomeViewModel from "./homeViewModel";

export const HomeView = registerViewComponent(HomeViewModel, vm => {
  return (
    <div>
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/invoices">Invoices</Link>
              <ul>
                <li>
                  <Link to="/invoices/4">Invoice 4</Link>
                </li>
                <li>
                  <Link to="/invoices/5">Invoice 5</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/customers">Customers</Link>
              <ul>
                <li>
                  <Link to="/customers" search={{ name: "abc" }}>
                    Customers search
                  </Link>
                </li>
              </ul>
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
