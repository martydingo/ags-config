{
  description = "My Awesome Desktop Shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    { self
    , nixpkgs
    , ags
    ,
    }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      packages.${system} = {
        default = ags.lib.bundle {
          inherit pkgs;
          src = ./.;
          name = "StatusBar";
          entry = "app.ts";
          gtk4 = true;

          # additional libraries and executables to add to gjs' runtime
          extraPackages = [
            # ags.packages.${system}.battery
            # pkgs.fzf
            ags.packages.${system}.io
            ags.packages.${system}.astal4
            ags.packages.${system}.apps
            ags.packages.${system}.auth
            ags.packages.${system}.battery
            ags.packages.${system}.bluetooth
            ags.packages.${system}.cava
            ags.packages.${system}.greet
            ags.packages.${system}.hyprland
            ags.packages.${system}.mpris
            ags.packages.${system}.network
            ags.packages.${system}.notifd
            ags.packages.${system}.powerprofiles
            ags.packages.${system}.river
            ags.packages.${system}.tray
            ags.packages.${system}.wireplumber
          ];
        };
      };
    };
}
