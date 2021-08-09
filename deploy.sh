
echo "Deploying..."
cp ./prod-template.yml ./template.yml
npm i
sam build
sam deploy