# FTC Simulation & PedroPathing Visualizer

Hey! This is a project built for the FTC community to make testing autonomous paths and robot models way less painful. It features both a 3D environment for dropping in your own CAD models and a 2D tool specifically tailored for testing and visualizing [PedroPathing](https://github.com/Pedro-Pathing/PedroPathing) code.

Check out the live demo here: [https://funny-florentine-f524a5.netlify.app](https://funny-florentine-f524a5.netlify.app)

---

## What's in here?

* **3D Simulation Mode:** Drop your robot CAD models right into a virtual field environment to test clearance, dimensions, and movement behavior.
* **PedroPathVisualizer (2D Mode):** A clean interface built to help test, debug, and preview PedroPathing trajectories quickly without needing to spin up a full robot every time.
* **Web-Based:** Runs straight out of the browser using Vite and Three.js, so you don't need to install a heavy setup just to check a path.

## Quick Start

If you want to run it locally:

```bash
# Clone the repo
git clone [https://github.com/Rizzington-III/FTC-Simulation.git](https://github.com/Rizzington-III/FTC-Simulation.git)

# Navigate into the folder
cd FTC-Simulation

# Install dependencies
npm install

# Fire up the local dev server
npm run dev

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
