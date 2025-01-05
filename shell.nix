{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  packages = [
    pkgs.nodejs_22
  ];
  propagatedBuildInputs = [
  ];
  
  buildInputs = [
  ];
  inputsFrom = [
  ];
  shellHook = ''
  '';
}
