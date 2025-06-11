export default {
    async fetch(request, env, ctx) {
      const { method } = request;
      const url = new URL(request.url);
      const auth = request.headers.get("Authorization");
      const expected = "Basic " + btoa("sixdayshabits:sixdaysupload");
  
      if (auth !== expected) {
        return new Response("Unauthorized", {
          status: 401,
          headers: { "WWW-Authenticate": 'Basic realm="R2 Upload"' },
        });
      }
  
      // Buat folder
      if (method === "POST" && url.searchParams.has("create-folder")) {
        const folder = url.searchParams.get("create-folder");
        const key = folder.replace(/\/+$/, "") + "/.keep";
        await env.MY_BUCKET.put(key, new Blob([]));
        return new Response("Folder created: " + folder);
      }
  
      // List folders
      if (url.searchParams.has("list")) {
        const result = await env.MY_BUCKET.list({ prefix: "", delimiter: "/" });
        const folders = result.delimitedPrefixes || [];
        return new Response(JSON.stringify(folders), {
          headers: { "Content-Type": "application/json" }
        });
      }
  
      // Upload file
      if (method === "POST") {
        const formData = await request.formData();
        const file = formData.get("file");
        const folder = formData.get("folder");
  
        if (!file || typeof file === "string") {
          return new Response("Invalid file", { status: 400 });
        }
  
        const objectKey = (folder ? folder + "/" : "") + file.name;
        await env.MY_BUCKET.put(objectKey, file.stream(), {
          httpMetadata: { contentType: file.type },
        });
  
        return new Response(`File uploaded to https://media.sdhstorage.web.id/${objectKey}`);
      }
  
      return new Response("Ready for upload!", {
        headers: { "Content-Type": "text/plain" }
      });
    }
  };
  
  // Deploy to Git