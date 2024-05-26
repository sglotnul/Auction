FROM node:14 AS node-build
WORKDIR /app/client_app

COPY ./Auction.Services/client_app/package*.json ./
RUN npm install

COPY ./Auction.Services/client_app .
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:8.0 as build

WORKDIR /sln

COPY ./*.sln ./
COPY ./*/*.csproj ./

RUN for file in $(ls *.csproj); do mkdir -p ${file%.csproj}/ && mv $file ${file%.csproj}/; done

RUN dotnet restore
COPY . .
RUN dotnet build -c Release

FROM build as publish
RUN dotnet publish "./Auction.Services/Auction.Services.csproj" -c Release --output /dist/services --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS services

EXPOSE 5011

WORKDIR /app

COPY --from=node-build /app/client_app/build ./client_app/build
COPY --from=publish /dist/services .

ENTRYPOINT ["dotnet", "Auction.Services.dll"]