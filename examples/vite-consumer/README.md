# Vite compiled-package consumer

This runnable example uses Vite 8.1.6 and React/React DOM 19.2.8, pinned in its own package and lockfile. It consumes an actual local `@cyberskill/design` tarball through the default compiled ESM export and a compiled component subpath. It does not load the workspace source tree or the legacy browser registry. No publication of the current working tree is assumed.

Use the repository's supported Node version (Node 22.23.3 and the minimum Node 22.12.0 were tested with Vite 8.1.6; the example requires Node ≥22.12). From the repository root, build the producer and pack it:

```sh
npm run build
mkdir -p /tmp/cyberskill-package
npm pack --ignore-scripts --pack-destination /tmp/cyberskill-package
```

Then, from `examples/vite-consumer`, prepare the tarball path printed by `npm pack`:

```sh
npm run use-design-tarball -- /absolute/path/to/cyberskill-design-1.7.2.tgz
npm install --ignore-scripts
npm run dev
```

Open the URL Vite prints. Choose a city, change the seat count and submit the form. The result announces the selected values. `FormField` comes from the package default export, while `Combobox` comes from a component subpath; their label/hint association and controller values exercise the shared compiled field context.

For a production build:

```sh
npm run build
npm run preview
```

`dist/consumer-build-inputs.json` records the resolved package JavaScript modules and the compiled chunks whose source maps include field-association code. The interaction regression checks that root and subpath controls actually share that context. The build fails if package JavaScript comes from the raw JSX/source surface. No custom JSX dependency transformer is configured.

The tarball is deliberately not committed. `use-design-tarball` stores it under a content-derived filename and updates the local file dependency. `npm install --ignore-scripts` then deliberately refreshes the lockfile for that artifact. Review these changes when testing a different producer; an old lock should not silently represent a different package. Once the matching tarball is present, `npm ci --ignore-scripts` reproduces that prepared consumer. Both package and lockfile keep the exact Vite/React versions.

The repository regression `node _audit/ci/test-vite-consumer.mjs` packs the current built producer into a disposable directory, installs this consumer independently, builds it, and drives the production output in real browsers. Pass an existing producer tarball as its first argument when testing a deliberately frozen package snapshot. It preserves the separate `examples/npm-hello` registry/legacy-browser contract.

The example demonstrates the tested compiled consumer workflow. It does not establish release publication, arbitrary bundler support, manual assistive-technology acceptance or dependency-security approval.

The Vite 8.1.6 patch is the upstream fix on the existing 8.1 line for [GHSA-587h-7wmj-h5pm](https://github.com/advisories/GHSA-587h-7wmj-h5pm), [GHSA-698v-4r3x-3vcv](https://github.com/advisories/GHSA-698v-4r3x-3vcv) and [GHSA-r825-w8mm-5pxw](https://github.com/advisories/GHSA-r825-w8mm-5pxw). The advisories concern editor-opening tooling, including Windows command handling. Both the repository toolchain and this example keep the existing audit policy for all dependency classes; the patch does not add an exception or change a severity threshold. Audit results remain time-bound evidence, not a permanent security guarantee.
