Screens and navigation are separated. Each screen has a `navigator` property with a concrete implementation of navigator. Thus, we can easily combine screens with different navigation strategies.



# Screen lifecycle

# Navigation

Each navigator builds its navigation state of its children. Router walks the path to the root and then gets the state providing overrides for the new path.

Use cases:
1. Get current URL - call root and get current state with full primary path
2. Get navigation URL to a child
3. Get navigation URL to any place