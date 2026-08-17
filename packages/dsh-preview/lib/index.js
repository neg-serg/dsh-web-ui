    // dsh-preview host half: serves image files from the user's workspaces,
    // home and tmp dirs to the browser at /dsh-preview/<path>. The markdown
    // renderer (dsh-client-ui-primitives, patched in dsh-web-en) rewrites
    // non-URL image sources to this route, so `![name](path)` previews local
    // images in assistant messages and thoughts. Image content types only;
    // paths must resolve inside an allowed root (workspace registry + home +
    // tmp). Loopback-only surface; read-only by design.
    import { readFileSync, existsSync, statSync } from "node:fs";
    import { homedir } from "node:os";
    import { extname, isAbsolute, join, resolve, sep } from "node:path";

    const inject = ["webServer"];

    const IMAGE_TYPES = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".avif": "image/avif",
      ".svg": "image/svg+xml",
    };

    const MAX_BYTES = 25 * 1024 * 1024;
    const PREFIX = "/dsh-preview/";

    function allowedRoots() {
      const home = homedir();
      const roots = new Set([home, "/tmp", "/var/tmp"]);
      try {
        const registry = JSON.parse(
          readFileSync(join(home, ".dsh/storages/workspace.json"), "utf8"),
        );
        const workspaces = registry?.tables?.workspaces ?? {};
        for (const record of Object.values(workspaces)) {
          if (typeof record?.path === "string" && record.path !== "") {
            roots.add(record.path);
          }
        }
      } catch {
        /* registry unreadable — home + tmp roots still apply */
      }
      return [...roots];
    }

    function resolveAllowed(filePath, roots) {
      let candidate;
      if (filePath === "~" || filePath.startsWith("~/")) {
        candidate = join(homedir(), filePath.slice(filePath === "~" ? 1 : 2));
      } else if (isAbsolute(filePath)) {
        candidate = filePath;
      } else {
        // Relative path: first allowed root where it exists wins.
        for (const root of roots) {
          const probe = resolve(root, filePath);
          if (existsSync(probe)) return probe;
        }
        return null;
      }
      const resolved = resolve(candidate);
      for (const root of roots) {
        const base = resolve(root);
        if (resolved === base || resolved.startsWith(base + sep)) return resolved;
      }
      return null;
    }

    function apply(ctx) {
      ctx.effect(() =>
        ctx.webServer.register({
          kind: "prefix",
          path: PREFIX,
          handler(req, res) {
            try {
              const pathname = new URL(req.url ?? "/", "http://x").pathname;
              if (!pathname.startsWith(PREFIX)) {
                res.writeHead(404);
                res.end();
                return;
              }
              const filePath = decodeURIComponent(pathname.slice(PREFIX.length));
              const abs = resolveAllowed(filePath, allowedRoots());
              if (abs === null) {
                res.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
                res.end("dsh-preview: path outside allowed roots");
                return;
              }
              const type = IMAGE_TYPES[extname(abs).toLowerCase()];
              if (type === undefined) {
                res.writeHead(415, { "content-type": "text/plain; charset=utf-8" });
                res.end("dsh-preview: not an image");
                return;
              }
              if (!existsSync(abs) || !statSync(abs).isFile()) {
                res.writeHead(404);
                res.end();
                return;
              }
              if (statSync(abs).size > MAX_BYTES) {
                res.writeHead(413, { "content-type": "text/plain; charset=utf-8" });
                res.end("dsh-preview: file too large");
                return;
              }
              const body = readFileSync(abs);
              res.writeHead(200, {
                "content-type": type,
                "content-length": body.length,
                "cache-control": "private, max-age=60",
              });
              res.end(body);
            } catch (error) {
              res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
              res.end(String(error));
            }
          },
        }),
      );
    }

    export { apply, inject };