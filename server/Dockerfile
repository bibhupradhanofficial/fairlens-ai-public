FROM denoland/deno:alpine-1.37.0

EXPOSE 8080

WORKDIR /app

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY main.ts .

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts

CMD ["run", "--allow-net", "--allow-env", "main.ts"]
