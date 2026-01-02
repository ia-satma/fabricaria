{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.nodePackages.typescript
    pkgs.nodePackages.ts-node
    # Dependencias Críticás para Operación Panopticon (Puppeteer)
    pkgs.chromium
    pkgs.glib
    pkgs.nss
    pkgs.freetype
    pkgs.harfbuzz
    pkgs.ca-certificates
  ];
}
