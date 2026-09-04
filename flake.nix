{
  description = "The Automerge website";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-26.05";

    command-utils.url = "git+https://tangled.org/expede.wtf/nix-command-utils";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    command-utils,
    flake-utils,
    nixpkgs,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {inherit system;};

        nodejs = pkgs.nodejs_24;
        node = "${nodejs}/bin/node --disable-warning=ExperimentalWarning";
        npm = "${nodejs}/bin/npm";
        prettier = "${pkgs.prettier}/bin/prettier";

        format-pkgs = with pkgs; [
          alejandra
          nixpkgs-fmt
        ];

        asModule = command-utils.asModule.${system};
        cmd = command-utils.cmd.${system};

        command_menu = command-utils.commands.${system} [
          (asModule {
            "deps:install" =
              cmd "Install npm dependencies from the lockfile"
              "${npm} ci";

            "fmt" =
              cmd "Format the codebase with prettier"
              "${prettier} --write .";

            "fmt:check" =
              cmd "Check formatting with prettier"
              "${prettier} --check .";

            "site:build" =
              cmd "Build the website into public/"
              "${node} system/app.ts build";

            "site:dev" =
              cmd "Build the site & start the live-reloading dev server"
              "${node} system/app.ts dev";

            "site:help" =
              cmd "Show the site build system help"
              "${node} system/app.ts help";
          })
        ];
      in rec {
        packages = {
          website = pkgs.buildNpmPackage {
            pname = "automerge-website";
            version = "0.1.0";

            meta = {
              description = "The Automerge website";
              homepage = "https://automerge.org";
              license = pkgs.lib.licenses.mit;
              maintainers = [pkgs.lib.maintainers.expede];
            };

            src = ./.;
            inherit nodejs;

            npmDepsHash = "sha256-GYLbEzgdOFNqeDrUehxOQB6MxVeRIC+EuKsn6qForAA=";

            # The build system is invoked directly rather than via
            # `npm run build` so we can silence Node's experimental
            # type-stripping warning, matching CI.
            dontNpmBuild = true;

            buildPhase = ''
              runHook preBuild
              ${node} system/app.ts build
              runHook postBuild
            '';

            installPhase = ''
              runHook preInstall
              cp -r public $out
              runHook postInstall
            '';
          };

          default = packages.website;
        };

        devShells.default = pkgs.mkShell {
          name = "automerge-website";

          nativeBuildInputs =
            command_menu
            ++ [
              nodejs
              pkgs.prettier
              pkgs.typescript
            ]
            ++ format-pkgs;

          shellHook = ''
            menu
          '';
        };

        formatter = pkgs.alejandra;
      }
    );
}
