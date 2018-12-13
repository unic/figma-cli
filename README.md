# Figma CLI
A CLI to export and scaffold from Figma directly into style guides like Estatico

## How-To

1. Install the Figma CLI
2. Add a `.figma` file to the root of your project with at least a Figma token and a project id
3. Run `$ figma` from the root of your project

## ToDos

- [ ] Colors -> Variables
- [ ] Fonts -> Mixins
- [ ] Icons -> SVG (Sprite & individual files, optimized!)
- [ ] Atoms -> Modules / React or Vue Components
- [ ] Molecules -> Modules
- [ ] Pages -> Pages or routes
- [ ] Whitespace -> Variables
- [ ] Breakpoints -> Variables
- [ ] Grid -> Variables
- [ ] Styles -> Mixins

## Naming Conventions

You have to structure your Figma documents in a certain way and use a naming convention (to be defined), for the CLI to be able to extract all info.