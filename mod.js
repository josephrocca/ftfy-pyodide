
// yolo:
let pyodideText = await fetch("https://cdn.jsdelivr.net/pyodide/v0.16.1/full/pyodide.js").then(r => r.text());
eval(pyodideText);
await loadPyodide({indexURL : "https://cdn.jsdelivr.net/pyodide/v0.16.1/full/"});

await pyodide.runPythonAsync(`
  import micropip
  await micropip.install('https://deno.land/x/ftfy_pyodide@v0.1/wcwidth-0.2.5-py2.py3-none-any.whl')
  await micropip.install('https://deno.land/x/ftfy_pyodide@v0.1/ftfy-6.0-py3-none-any.whl')
  import ftfy
`);

export default pyodide.globals.get("ftfy");