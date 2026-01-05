{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.nodePackages.pnpm
    pkgs.postgresql
    pkgs.git
  ];
}
