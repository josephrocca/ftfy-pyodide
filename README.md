# ftfy-pyodide
A JavaScript port of Python's ftfy module (using Pyodide)

https://pypi.org/project/ftfy/

<script type=module>
  import ftfy from "https://deno.land/x/ftfy_pyodide@v0.1.1/mod.js";

  console.log( ftfy.fix_text("(à¸‡'âŒ£')à¸‡") ); // (ง'⌣')ง
</script>
