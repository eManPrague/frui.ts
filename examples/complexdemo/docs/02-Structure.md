# Application structure

We will be using the following structure to organize files within the solution. Note that the whole structure should be in the `src` folder.

- assets
  - icons
  - themes
- controls
- data
  - entities
  - repositories
- models
- services
- utils
- viewModels
- views

In case the application is really large, split in into modules:

- assets
  - icons
  - themes
- controls
- modules
  - Module A
    - entities
    - models
    - repositories
    - services
    - viewModels
    - views
  - Module B
    - entities
    - models
    - repositories
    - services
    - viewModels
    - views
- utils
