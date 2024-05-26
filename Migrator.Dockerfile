### build
FROM mcr.microsoft.com/dotnet/sdk:8.0 as build
WORKDIR /sln

COPY ./*.sln ./
COPY ./*/*.csproj ./

RUN for file in $(ls *.csproj); do mkdir -p ${file%.csproj}/ && mv $file ${file%.csproj}/; done

RUN dotnet restore
COPY . .
RUN dotnet build -c Release

FROM build as publish
RUN dotnet publish "./Auction.Migrator/Auction.Migrator.csproj" -c Release --output /dist/migrator --no-restore

### migrator
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS sqlmigrator
COPY --from=publish /dist/migrator /app/
WORKDIR /app
RUN echo '#!/bin/bash\n dotnet /app/Auction.Migrator.dll' > /run.sh
RUN ["chmod", "+x", "/run.sh"]
ENTRYPOINT ["/run.sh"]