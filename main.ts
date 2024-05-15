const port = 8000;

const handler = async (request: Request): Promise<Response> => {
  try {
    console.log("Requested URL:", request.url);

    const { pathname } = new URL(request.url);

    if (request.method === "GET" && pathname === "/") {
      const body = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>File Upload</title>
        </head>
        <body>
          <h1>File Upload</h1>
          <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="image">
            <button type="submit">Upload</button>
          </form>
        </body>
        </html>
      `;
      return new Response(body, { status: 200, headers: { "Content-Type": "text/html" } });
    } else if (request.method === "POST" && pathname === "/upload") {
      const formData = await request.formData();
      const file = formData.get("image");

      if (file instanceof File) {
        const fileName = file.name;
        const filePath = `./stuff/${fileName}`;
        const reader = formData.get("image").arrayBuffer();
        const data = new Uint8Array(await reader);
        await Deno.writeFile(filePath, data);
        
        // Now you can process the uploaded file stored at filePath
        
        return new Response(`File uploaded successfully. Saved in the 'stuff' directory as: ${filePath}`, { status: 200 });
      } else {
        return new Response("No file uploaded.", { status: 400 });
      }
    } else {
      return new Response("Not found", { status: 404 });
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

console.log(`HTTP server running. Access it at: http://localhost:${port}/`);
Deno.serve({ port }, handler);
