A quick JavaScript "port" of Python's [ftfy](https://pypi.org/project/ftfy/) ("fixes text for you") using [Pyodide](https://github.com/pyodide/pyodide). It fixes text encoding issues (mojibake). For example, it converts `â€™` back into `'`. You can use it like this:

```js
import ftfy from "https://deno.land/x/ftfy_pyodide@v0.1.1/mod.js";
ftfy.fix_text("(à¸‡'âŒ£')à¸‡"); // (ง'⌣')ง
```

If you want it to be available as a global variable (like an old-school script tag import), use this code:
```html
<script type=module>
  import ftfy from "https://deno.land/x/ftfy_pyodide@v0.1.1/mod.js";
  window.ftfy = ftfy;
</script>
```

The Python version is about 4x faster, which is to be expected given that Pyodide is running the Python runtime within WebAssembly. I'm guessing the performance gap will be smaller once we get [wasm-gc](https://github.com/WebAssembly/gc).

The actual `ftfy` code package is quite small (tens of KB), but Pyodide is several MB, so it's not going to be useful to you if you need something light-weight. If you are importing multiple Pyodide-based packages, you'd want to only import the Pyodide code once, and then load the `.whl` files after that.

It doesn't run yet in Deno due to `pyodide.js` assuming that the runtime is either browser or web worker, but it should only take a few code changes (e.g. [here](https://github.com/pyodide/pyodide/blob/093c0dd18ddcefa4cc1bce5f404f4cec2444ef9d/src/pyodide.js#L58-L73)) to get it working. I personally don't need Deno support right now, so I'm going to instead wait and hope that `pyodide.js` moves to ES modules, and then I can just bump the version and get Deno support for free.

`ftfy` was created by Robyn Speer at [Luminoso Technologies, Inc.](LuminosoInsight) and is MIT licensed. It depends upon [wcwidth](https://github.com/jquast/wcwidth) (by [Jeff Quast](https://github.com/jquast)) which is also MIT licensed. [Pyodide](https://github.com/pyodide/pyodide) is licensed under [Mozilla Public License 2.0](https://choosealicense.com/licenses/mpl-2.0/). **All credit for this module goes to Robyn Speer, Jeff Quast and the Pyodide contributors** - I just wrote a few lines of code to wrap it into a JS module.

## As stated by the `ftfy` docs:

ftfy can fix mojibake (encoding mix-ups), by detecting patterns of characters that were clearly meant to be UTF-8 but were decoded as something else:

```js
ftfy.fix_text('âœ” No problems') // '✔ No problems'
```
Does this sound impossible? It's really not. UTF-8 is a well-designed encoding that makes it obvious when it's being misused, and a string of mojibake usually contains all the information we need to recover the original string.

ftfy can fix multiple layers of mojibake simultaneously:

```js
ftfy.fix_text('The Mona Lisa doesnÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢t have eyebrows.') // 'The Mona Lisa doesn't have eyebrows.'
```

It can fix mojibake that has had "curly quotes" applied on top of it, which cannot be consistently decoded until the quotes are uncurled:

```js
ftfy.fix_text("l’humanitÃ©") // "l'humanité"
```

ftfy can fix mojibake that would have included the character U+A0 (non-breaking space), but the U+A0 was turned into an ASCII space and then combined with another following space:

```js
ftfy.fix_text('Ã\xa0 perturber la rÃ©flexion') // 'à perturber la réflexion'
ftfy.fix_text('Ã perturber la rÃ©flexion') // 'à perturber la réflexion'
```

ftfy can also decode HTML entities that appear outside of HTML, even in cases where the entity has been incorrectly capitalized:

```js
// by the HTML 5 standard, only 'P&Eacute;REZ' is acceptable
ftfy.fix_text('P&EACUTE;REZ') // 'PÉREZ'
```

These fixes are not applied in all cases, because ftfy has a strongly-held goal of avoiding false positives -- it should never change correctly-decoded text to something else.

The following text could be encoded in Windows-1252 and decoded in UTF-8, and it would decode as 'MARQUɅ'. However, the original text is already sensible, so it is unchanged.

```js
ftfy.fix_text('IL Y MARQUÉ…') // 'IL Y MARQUÉ…'
```

# Upgrading

`ftfy` doesn't publish a wheel file in its new releases, and so if the `ftfy` Python package gets an update, and you'd like to use that updated version in JS, then you'll need to generate a `.whl` file based on the latest release. To do that, you can paste the following code in a [Google Colab notebook](https://colab.research.google.com/) cell and execute it:

```python
!git clone https://github.com/LuminosoInsight/python-ftfy
%cd python-ftfy
!pip wheel .

from google.colab import files
import glob
files.download(glob.glob('./*.whl')[0])
```

You can get the latest wcwidth `.whl` file from here: https://pypi.org/project/wcwidth/#files


# License

Here's [the license from the python-ftfy repo](https://github.com/LuminosoInsight/python-ftfy/blob/master/LICENSE.txt):

```
Copyright (C) 2013-2018 Robyn Speer (rspeer@luminoso.com)
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

And here's the one for [wcwidth](https://github.com/jquast/wcwidth/blob/master/LICENSE):

```
The MIT License (MIT)

Copyright (c) 2014 Jeff Quast <contact@jeffquast.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Markus Kuhn -- 2007-05-26 (Unicode 5.0)

Permission to use, copy, modify, and distribute this software
for any purpose and without fee is hereby granted. The author
disclaims all warranties with regard to this software.
```

As previously mentioned, Pyodide is [licensed under Mozilla Public License 2.0](https://github.com/pyodide/pyodide/blob/master/LICENSE).

All other code in this repo is licensed under the MIT License.
