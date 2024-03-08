yarn workspaces run clean
OPTIMIZER_ENABLED=true yarn workspaces run compile

echo "Deploying DSU..."
yarn workspace @emptyset/dsu run deploy:fork:arbitrumGoerli --tags DSU --no-compile
echo "done. Deploying Core..."
yarn workspace @emptyset/reserve run deploy:fork:arbitrumGoerli --tags Deploy_Core --no-compile
echo "done. Transferring DSU Ownership..."
yarn workspace @emptyset/dsu run deploy:fork:arbitrumGoerli --tags Transfer_DSU --no-compile
echo "done. Initializing Core..."
yarn workspace @emptyset/reserve run deploy:fork:arbitrumGoerli --tags Init_Core --no-compile
echo "done."
