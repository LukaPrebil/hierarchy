# D3.js hierarchical data visualization

Project to visualize hierarchical data using D3.js. Available on [Github Pages](https://lukaprebil.github.io/hierarchy/).

Written with D3.js and Material UI in Typescript React. Build with Vite.

Users can skip individual rows by clicking on the circle icon on the row. They can also invert a row by clicking on the star icon. To reset the row they can click on the square icon.
Users can also modify an entire subtree by using the provided actions on any internal node.

The page also supports changing the font, its size and weight.
The user can also enable the option to highlight any negative values in red as an example of a potential business requirement.

The page is responsive, running on a single column on mobile devices and on multiple columns on larger screens. This is implemented with MUI Grid, which emulates the CSS Grid using flexbox.

## Development decisions

The reason I chose Vite and MUI is because I've heard good things and wanted to try them out. I've also heard that Vite is faster than Create React App, which I've used before. I've never used D3.js before, so the code is loosely based on the examples I found online.

It seems to work reasonably well with a few thousand nodes, but scrolling can lag on 10k+ nodes. For large datasets, some kind of virtualization would be needed, but I ran out of time to implement that.

## Development

There is a basic CI/CD pipeline that builds the page and deploys it to Github Pages. The pipeline is defined in `.github/workflows/deploy-to-pages.yaml`.

### Running the project

To run the project, clone the repository and run `nvm use` (or use node 20), `npm install` and `npm run dev`. The project will be available on `localhost:5173`.

To run tests, run `npm run test` which will run a basic (non-exhaustive) vitest suite.
